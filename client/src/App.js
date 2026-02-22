import { useState, useEffect, useCallback } from 'react';
import ShuffleOptions from './components/ShuffleOptions';
import Player from './components/Player';
import LogInButton from './components/LogInButton';
import Container from './components/Container';
import { useAuth } from './context/AuthContext';
import { getPlayerInfo, getPlaylists } from './utils.ts';
import './App.css';

const PLAYLIST_CACHE_TTL = 60 * 60 * 1000; // 1 hour

const getCachedPlaylists = (userId) => {
	try {
		const cached = JSON.parse(localStorage.getItem(`playlists_${userId}`));
		if (cached && Date.now() - cached.timestamp < PLAYLIST_CACHE_TTL)
			return cached.data;
	} catch {}
	return null;
};

const setCachedPlaylists = (userId, playlists) => {
	try {
		localStorage.setItem(`playlists_${userId}`, JSON.stringify({ data: playlists, timestamp: Date.now() }));
	} catch {}
};

const App = function() {
	const [ error, setError ] = useState("");
	const [ playingTrack, setPlayingTrack ] = useState(null);
	const [ allPlaylists, setAllPlaylists ] = useState([]);
	const [ myPlaylists, setMyPlaylists ] = useState([]);
	const { accessToken, isAuthenticated, userId } = useAuth();

	const refreshNowPlaying = async () => {
		try {
			let player = await getPlayerInfo({ accessToken });
			setPlayingTrack(player.item);
		} catch(e) {
			setError(e);
		}
	}
	
	const refreshPlaylists = myPlaylistsOnly => {
		if (myPlaylistsOnly) {
			setMyPlaylists(filterPlaylists(allPlaylists))
		} else {
			setMyPlaylists(allPlaylists);
		}
	}

	// Filter playlists based on "My playlists only" selection
	const filterPlaylists = useCallback(playlists => {
		return playlists.filter(playlist => {
			return playlist.owner && playlist.owner.id === userId;
		});
    }, [userId])

 	useEffect(() => {

		const getData = async () => {
			try {
				// Populate the now playing track info
				let player = await getPlayerInfo({ accessToken });
				setPlayingTrack(player.item);
			} catch (e) {
				setError(e);          
			}

			try {
				// Pull all playlists
				const cached = getCachedPlaylists(userId);
				const playlists = cached ?? await getPlaylists({ accessToken, userId });
				if (!cached) setCachedPlaylists(userId, playlists);
				setAllPlaylists(playlists);
				setMyPlaylists(filterPlaylists(playlists));
			} catch (e) {
				setError(e);
			}
		}

    if (isAuthenticated && userId) 
		getData();

  }, [isAuthenticated, userId, accessToken, filterPlaylists]);

    // refresh now playing info every ~3.5 mins (avg song length) to keep the display up to date
	useEffect(() => {
		if (!isAuthenticated) return;
		const interval = setInterval(refreshNowPlaying, 210000);
		return () => clearInterval(interval);
	}, [isAuthenticated, accessToken]);

  return (
	<Container>
		{isAuthenticated ? (
			<>	
				{ error &&
					<div className="alert alert-danger alert-dismissible" role="alert">
						{error?.message}
						<button type="button" onClick={() => setError("")}>&times;</button>
					</div>
				}
				<Player track={playingTrack} />
				<ShuffleOptions
					playlists={myPlaylists}
					refreshNowPlaying={() => refreshNowPlaying()}
					refreshPlaylists={myPlaylistsOnly => refreshPlaylists(myPlaylistsOnly)}
					onError={setError}
				/>
			</>
		) : (
			<LogInButton />
		)}
	</Container>
  );
}

export default App;
