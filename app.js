const express = require('express');
const request = require('request'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { generateRandomString, shuffle } = require('./global.js');

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token/';
const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize/';
const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1'; 
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8888/callback'; 

const stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(__dirname + '/client/public'))
	 .use(cors())
	 .use(cookieParser());

/*
 * Authenticates a Spotify user using implicit grant flow
*/
app.get('/login', function(req, res) {

	const state = generateRandomString(16);

	res.cookie(stateKey, state);

	let scope = 'user-read-private user-read-email user-modify-playback-state'
		scope += ' user-read-playback-state user-library-read playlist-read-private';

	const token_string = new URLSearchParams({
		response_type: 'code',
		client_id: client_id,
		scope: scope,
		redirect_uri: redirect_uri,
		state: state
	}).toString();

	res.redirect(`${SPOTIFY_AUTH_ENDPOINT}?${token_string}`);

});

/*
 * Requests refresh and access tokens
 *
 * @name /callback
 * @body {string} code - Code
 * @body {string} state - State
*/
app.get('/callback', async function(req, res) {

	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {

		res.send({message: 'State mismatch'});

	} else {
		
		res.clearCookie(stateKey);

		const token_string = await getAccessToken(code);

		res.redirect('http://localhost:3000/?' + token_string);
		
	}
	
});

/*
 * Request access token from refresh token
 *
 * @name /refresh_token
 * @body {string} refresh_token - Spotify refresh token
 * @returns {string} access_token - Spotify access token
*/
app.get('/refresh_token', function(req, res) {

	const refresh_token = req.query.refresh_token;
	const options = {
		url: SPOTIFY_TOKEN_ENDPOINT,
		headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			const access_token = body.access_token;
			res.send({'access_token': access_token});			
		}
	});

});

/*
 * Returns a list of playlists for the currently authenticated user
 *
 * @name /playlists
 * @body {string} access_token - Spotify access token
 * @body {string} user_id - User ID
 * @returns {array} all_tracks - List of tracks
*/
app.get('/playlists', async function(req, res) {

	const access_token = req.query.access_token;
	const user_id = req.query.user_id;

	// Get a list of my playlists 
	const playlists = await getPlaylists(user_id, 0, access_token);

	// The limit is 50, so fetch them again
	const playlists_2 = await getPlaylists(user_id, 50, access_token);
	
	// The limit is 50, so fetch them again
	const playlists_3 = await getPlaylists(user_id, 100, access_token);

	// Merge the playlists
	all_playlists = [...playlists, ...playlists_2, ...playlists_3];

	res.send({
		'playlists': all_playlists
	});

});

/*
 * Retrieves a random list tracks across all playlists
 *
 * @name /shuffle
 * @body {string} access_token - Spotify access token
 * @body {string} user_id - User ID
 * @body {boolean} include_all_playlists - If true, all playlists will be used (user owned & other)
 * @body {boolean} include_liked_tracks - If true, liked tracks will be included
 * @body {array} [filter_playlists] - Array of playlists
 * @returns {array} all_tracks - List of tracks
*/
app.get('/shuffle', async function(req, res) {

	const access_token = req.query.access_token;
	const user_id = req.query.user_id;
	const include_all_playlists = req.query.include_all_playlists;
	const include_liked_tracks = req.query.include_liked_tracks;
	const filter_playlists = req.query.filter_playlists || [];
	
	let all_tracks = [];

	// If specific list of playlist was passed, use this
	// Otherwise obtain list of user playlists
	if(filter_playlists.length > 0) {

		// Iterate through each playlist
		for(let i = 0; i < filter_playlists.length; i++) {
	
			let tracks_url = filter_playlists[i];

			// Fetch the list of tracks for the playlist
			let tracks_list = await getPlaylistTracks(tracks_url, access_token);
	
			// Add the tracks to our main list
			all_tracks = all_tracks.concat(tracks_list);
	
		}

	} else {

		// Get a list of my playlists 
		const playlists = await getPlaylists(user_id, 0, access_token);

		// The limit is 50, so fetch them again
		const playlists_2 = await getPlaylists(user_id, 50, access_token);

		// Merge the 2 playlists
		let all_playlists = [...playlists, ...playlists_2];

		// Get the tracks for each playlist
		all_tracks = await getTracksFromPlaylists(all_playlists, include_all_playlists, user_id, access_token);
	}

	// Fetch the user's liked tracks 
	let liked_tracks = [];
	if(include_liked_tracks == 1)
		liked_tracks = await getLikedTracks(access_token);

	// Merge all the tracks
	all_tracks = [...all_tracks, ...liked_tracks];

	// Remove duplicate tracks
	let unique_tracks = all_tracks.reduce(function(a,b){
		if (a.indexOf(b) < 0 ) a.push(b);
		return a;
	},[]);

	// Shuffle the array
	all_tracks = shuffle(unique_tracks);

	// Truncate array
	if(all_tracks.length > 50)
		all_tracks.length = 50;

	res.send({
		'all_tracks': all_tracks
	});
	
});

/*
 * Returns a list of tracks for a given set of playlists
 *
 * @param {array} playlists - Array of playlists
 * @param {boolean} include_all_playlists - If false, only user owned playlists will be used
 * @param {string} user_id - User ID
 * @param {string} access_token - Spotify access token
 * @returns {array} all_tracks - List of tracks
*/
const getTracksFromPlaylists = async function(playlists, include_all_playlists, user_id, access_token) {

	let all_tracks = [];

	// Iterate through each playlist
	for(let i = 0; i < playlists.length; i++) {

		let item = playlists[i];
		let name = item.name;
		let owner = item.owner;
		let tracks = item.tracks;
		let tracks_url = tracks.href;

		// Filter by playlists that I created
		if(include_all_playlists == 0) {
			if(owner && owner.id !== user_id)
				continue;
		}
		
		// Fetch the list of tracks for the playlist
		let tracks_list = await getPlaylistTracks(tracks_url, access_token);

		// Add the tracks to our main list
		all_tracks = all_tracks.concat(tracks_list);

	}

	return all_tracks;

}

/*
 * Retrieves a list of playlists for a user
 *
 * @param {string} user_id - User ID
 * @param {string} offset - Index of the first playlist to return
 * @param {string} access_token - Spotify access token
 * @returns {array} items - Array of playlists
*/
const getPlaylists = function(user_id, offset, access_token) {

	return new Promise((resolve, reject) => {
	
		try {
		
			const options = {
				url: `${SPOTIFY_API_ENDPOINT}/users/${user_id}/playlists?limit=50&offset=${offset}`,
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};
		
			request.get(options, function(error, response, body) {
				if (!error && response.statusCode === 200) {

					let items = body.items;
					resolve(items);
	
				}
			});
			
		} catch (e) {
			reject(e);
		}
	
	});

}

/*
 * Retrieves a list of tracks for a playlist
 *
 * @param {string} url - Track URL
 * @param {string} access_token - Spotify access token
 * @returns {array} items - Array of tracks
*/
const getPlaylistTracks = function(url, access_token) {

	return new Promise((resolve, reject) => {
	
		try {
			
			let tracks = [];
	
			const options = {
				url: `${url}?fields=items(track(id,name,href))`,
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};
		
			request.get(options, function(error, response, body) {
				if (!error && response.statusCode === 200) {

					let items = body.items;

					for(let i = 0; i < items.length; i++) {

						let item = items[i];
						let track = item && item.hasOwnProperty('track') ? item.track : null;
						
						if(!track)
							continue;

						let track_href = item.track && item.track.hasOwnProperty('href') ? item.track.href : '';
						let track_id = item.track && item.track.hasOwnProperty('id') ? item.track.id : '';

						let track_uri = `spotify:track:${track_id}`;

						tracks.push(track_uri);

					}
		
					resolve(tracks);
	
				}
			});
			
		} catch (e) {
			reject(e);
		}
	
	});

}
 
/*
 * Retrieves a list of playlists for a user
 *
 * @param {string} access_token - Spotify access token
 * @returns {array} items - Array of playlists
*/
const getLikedTracks = function(access_token) {

	return new Promise((resolve, reject) => {
	
		try {
		
			const options = {
				url: `${SPOTIFY_API_ENDPOINT}/me/tracks`,
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};
		
			request.get(options, function(error, response, body) {

				if (!error && response.statusCode === 200) {

					let items = body.items;
					resolve(items);
	
				}
			});
			
		} catch (e) {
			reject(e);
		}
	
	});

}

/*
 * Obtain an access token
 *
 * @param {string} code - Code
 * @returns {string} token_string - Token string
*/
const getAccessToken = function(code) {

	return new Promise((resolve, reject) => {
	
		try {
		
			const options = {
				url: SPOTIFY_TOKEN_ENDPOINT,
				form: {
					code: code,
					redirect_uri: redirect_uri,
					grant_type: 'authorization_code'
				},
				headers: {
					'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
				},
				json: true
			};

			request.post(options, function(error, response, body) {
				if (!error && response.statusCode === 200) {

					let access_token = body.access_token; 
					let refresh_token = body.refresh_token;

					let token_string = new URLSearchParams({
						access_token: access_token,
						refresh_token: refresh_token
					}).toString();

					resolve(token_string);
					
				} else {
					reject('Invalid token');
				}
			});
			
		} catch (e) {
			reject(e);
		}
	
	});

}


console.log('Starting spotify shuffle');
app.listen(8888);
