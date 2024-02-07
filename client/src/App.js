import { useState, useEffect } from 'react';
import ShuffleOptions from './components/ShuffleOptions';
import Player from './components/Player';
import LogInButton from './components/LogInButton';
import { getUserInfo, getPlayerInfo, getPlaylists } from './utils.ts';
import './App.css';

const App = function() {
  const [ error, setError ] = useState("");
  const [ userId, setUserId ] = useState(null);
  const [ playingTrack, setPlayingTrack ] = useState(null);
  const [ playlists, setPlaylists ] = useState(null);

  const [isAuthenticated, setAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token !== null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return JSON.parse(token);
  });

  const queryString = window.location.search;
  const token = new URLSearchParams(queryString).get('access_token');

  // Get user information
  const getData = async () => {
    try {

      if (!userId) {
        let user = await getUserInfo(accessToken);
        setUserId(user.id);
      }

      if (!playingTrack) {
        let player = await getPlayerInfo(accessToken);
        setPlayingTrack(player.item);
      }

			if (!playlists) {
        let playlists = await getPlaylists(accessToken, userId);
        setPlaylists(playlists);
      }

    } catch (error) {
      setError(error);
    }
  }

  const updateNowPlaying = async () => {

    let player = await getPlayerInfo(accessToken);
    setPlayingTrack(player.item);

  }

  useEffect(() => {

    if (token)
      localStorage.setItem('accessToken', JSON.stringify(token));

    if (isAuthenticated) 
        getData();
    
  }, [token, isAuthenticated]);

  return (
		<div className="container gradient-border" id="main">
			{isAuthenticated ? (
				<>
					<Player track={playingTrack} />
					<ShuffleOptions 
						accessToken={accessToken} 
						userId={userId} 
						playlists={playlists} 
						refreshNowPlaying={() => updateNowPlaying() } 
					/>
				</>
			) : (
				<LogInButton />
			)}
		</div>
  );
}

export default App;
