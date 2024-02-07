import { useState, useEffect } from 'react';
import ShuffleOptions from './components/ShuffleOptions';
import Player from './components/Player';
import LogInButton from './components/LogInButton';
import { useAuth } from './context/AuthContext.js';
import { getPlayerInfo, getPlaylists } from './utils.ts';
import './App.css';

const App = function() {
  const [ error, setError ] = useState("");
  const [ playingTrack, setPlayingTrack ] = useState(null);
  const [ playlists, setPlaylists ] = useState(null);
	const { accessToken, isAuthenticated, userId } = useAuth();

  const refreshNowPlaying = async () => {
		try {

			let player = await getPlayerInfo(accessToken);
			setPlayingTrack(player.item);

		} catch(e) {
			setError(e);
		}
  }

  useEffect(() => {

		const getData = async () => {
			try {
				
				// Populate the now playing track info
				if (!playingTrack) {
					let player = await getPlayerInfo(accessToken);
					setPlayingTrack(player.item);
				}
				
				// Pull all playlists
				if (!playlists) {
					let playlists = await getPlaylists(accessToken, userId);
					setPlaylists(playlists);
				}
	
			} catch (e) {
				setError(e);
			}
		}

    if (isAuthenticated) 
			getData();

  }, [isAuthenticated, userId, accessToken, playingTrack, playlists]);

  return (
		<div className="container gradient-border" id="main">
			{isAuthenticated ? (
				<>
					<Player track={playingTrack} />
					<ShuffleOptions 
						playlists={playlists} 
						refreshNowPlaying={() => refreshNowPlaying() } 
					/>
				</>
			) : (
				<LogInButton />
			)}
		</div>
  );
}

export default App;
