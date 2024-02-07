(function() {
	let params = getHashParams();
	let accessToken = params.access_token;
	let error = params.error;
	let userId = '';
	let includeAllPlaylists = false;
	let includeLikedTracks = true;

    /*
        Pull a list of all my playlists
    */
    const getPlaylists = async function(accessToken, userId, ownedOnly) {

        let queryParams = new URLSearchParams({
            'access_token': accessToken,
            'user_id': userId
        });

        await fetch('/playlists/?' + queryParams, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            let allPlaylists = data.playlists;
            let playlists = filterPlaylists(allPlaylists, ownedOnly);

            displayPlaylistSelection(playlists);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

    /*
      Get information about the currently playing track
    */
    const getPlayerInfo = async function(accessToken) {

        await fetch('https://api.spotify.com/v1/me/player/', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then((response) => response.json())
        .then((data) => {
            showNowPlaying(data?.item);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
    }

    /*
      Initiate playback on the active user device
    */
    const playTracks = async function(tracks, userId) {

        await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uris: tracks
            }),
        })
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
            console.error('Error:', error);
        });

        // Get now playing info
        getPlayerInfo(accessToken, userId);

        // Restore shuffle button, remove loading state
        document.getElementById('loading').style.display = "none";
        document.getElementById('shuffleIcon').style.display = "block";
        document.getElementById('shuffleText').innerText = 'Shuffle';
      
    }
  
    /*
      Get user ID, load playlists
    */
    const getUserInfo = async function(accessToken) {

        await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then((response) => response.json())
        .then((data) => {

            userId = data.id;

            // Get a list of all my playlists
            getPlaylists(accessToken, userId, true);

            // Find out what is playing right now
            getPlayerInfo(accessToken, userId);
            
            // Display authenticated page
            document.getElementById('login').style.display = "none";
            document.getElementById('loggedin').style.display = "block";

        })
        .catch((error) => {
            console.error('Error:', error);
        });
    
    }

    /*
        Fetch shuffled tracks
    */
    const getShuffledTracks = async function(accessToken, userId, includeAllPlaylists, includeLikedTracks) {

        let queryParams = new URLSearchParams({
            'access_token': accessToken,
            'user_id': userId,
            'include_all_playlists': includeAllPlaylists,
            'include_liked_tracks': includeLikedTracks,
            //'filter_playlists': filter_playlists
        });

        await fetch('/shuffle/?' + queryParams, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.all_tracks) {
                playTracks(data.all_tracks, userId);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

    /*
      Filter playlists based on "My playlists only" selection
    */
    const filterPlaylists = function(allPlaylists, ownedOnly) {
        let filteredPlaylists = allPlaylists.filter(playlist => {
            return playlist.owner && playlist.owner.id == userId;
        });

        if (ownedOnly)
            return filteredPlaylists;
        else 
            return allPlaylists;
    }

    /*
      List filtered playlists with a checkbox
    */
    const displayPlaylistSelection = function(allPlaylists) {

        let playlistsHTML = "";
        let playlistsList = document.getElementById('playlists');

        allPlaylists.forEach(playlist => {

            let tracks = playlist?.tracks;
            let owner = playlist.owner;
            let ownedPlaylist = owner && owner.id == userId;

            let playlistNameClass = ownedPlaylist ? 'owned-playlist' : 'other-playlist';
            let checkBoxHTML = `<li><input type="checkbox" class="playlist-checkbox" name="playlist[]" value="${tracks?.href}" checked/>`;    
            checkBoxHTML += `<span class="${playlistNameClass}">${playlist?.name}</span></li>`;

            playlistsHTML += checkBoxHTML;

        });

        playlistsList.innerHTML = playlistsHTML;
        
    }

    /*
      Display now playing artist and song
    */
	const showNowPlaying = function(track) {

        let artistNames = track?.artists.map(artist => artist?.name);
        let artistNameDisplay = artistNames.join(", ");

        let artistName = document.getElementById('artistName');
        let songName = document.getElementById('songName');
        artistName.innerHTML = artistNameDisplay;
        songName.innerHTML = track?.name;
		
	}

    /*
      Filter playlists based on "My playlists only" selection
    */
    const toggleMyPlaylistsOnly = function() {
		let myPlaylistsOnly = this.checked;
		let myPlaylistsOnlyValue = document.getElementById('myPlaylistsOnlyValue');

		if(myPlaylistsOnly) {
			myPlaylistsOnlyValue.innerHTML = "ON";
		} else {
			myPlaylistsOnlyValue.innerHTML = "OFF";
		}

		// Refresh list of playlists
		getPlaylists(accessToken, userId, myPlaylistsOnly);
    }


    /*
      Toggle "Include like tracks"
    */
    const toggleIncludeLikedTracks = function() {
		let includeLikedTracksValue = document.getElementById('includeLikedTracksValue');

		if(this.checked) {
			includeLikedTracksValue.innerHTML = "ON";
		} else {
			includeLikedTracksValue.innerHTML = "OFF";
		}
    };

    /*
        Toggle display of playlist choices
    */
    const toggleChoosePlaylists = function() {
		let choosePlaylistsValue = document.getElementById('choosePlaylistsValue');
		let playlistsContainer = document.getElementById('playlistsContainer');

		if(this.checked) {
			choosePlaylistsValue.innerHTML = "ON";
			playlistsContainer.style.display = "block";

		} else {
			choosePlaylistsValue.innerHTML = "OFF";
			playlistsContainer.style.display = "none";
		}
    }

    /*
        Add ability to select/deselect all playlists
    */
    const toggleSelectAllPlaylists = function() {
        if(this.checked) {
          document.querySelectorAll('.playlist-checkbox').forEach(checkbox => {
            checkbox.checked = true;
          });
        } else {
          document.querySelectorAll('.playlist-checkbox').forEach(checkbox => {
            checkbox.checked = false;
          });
        }
    }

    /*
        Retrieve a list of shuffled tracks
    */
    const shuffle = async function() {

        // Show loading state
        document.getElementById('loading').style.display = "block";
        document.getElementById('shuffleIcon').style.display = "none";
        document.getElementById('shuffleText').innerText = 'Shuffling...';

        // Get iterable list of selected checkboxes elements
        let playlistItems = Array.from(document.getElementsByName('playlist[]'));
        let selectedPlaylists = playlistItems.filter((item) => item.checked);
        let filterPlaylists = selectedPlaylists.map((item) => item.value);

        // Fetch and play shuffled tracked
        let all_tracks = await getShuffledTracks(accessToken, userId, includeAllPlaylists, includeLikedTracks);
        if(all_tracks) {
            playTracks(all_tracks, userId);
        }
      
    }

    // Event listeners
    document.getElementById('selectAllPlaylists').addEventListener('click', toggleSelectAllPlaylists, false);
    document.getElementById('shuffle').addEventListener('click', shuffle, false);
    document.getElementById('myPlaylistsOnlyCheckbox').addEventListener('change', toggleMyPlaylistsOnly, false);
    document.getElementById('includeLikedTracksCheckbox').addEventListener('change', toggleIncludeLikedTracks, false);
    document.getElementById('choosePlaylistsCheckbox').addEventListener('change', toggleChoosePlaylists, false);

    if (error) {
        alert('There was an error authenticating');
    } else {
        if (accessToken) {

            getUserInfo(accessToken);

        } else {
            // Display logged out state
            document.getElementById('login').style.display = "block";
            document.getElementById('loggedin').style.display = "none";
        }
    }
})();