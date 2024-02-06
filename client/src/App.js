import { useState, useEffect } from 'react';
import './App.css';

const App = function() {
  const [ error, setError ] = useState("");
  const [ userId, setUserId ] = useState(null);
  const [ playingTrack, setPlayingTrack ] = useState(null);
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
  const getUserInfo = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      if (!response) {
        throw new Error('Failed to fetch user information');
      }
      const data = await response.json();
      setUserId(data.id);
    } catch (error) {
      setError(error.message);
    }
  }

  const getPlayerInfo = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      if (!response) {
        throw new Error('Failed to fetch player information');
      }
      const data = await response.json();
      setPlayingTrack(data.item);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {

    if (token)
      localStorage.setItem('accessToken', JSON.stringify(token));

    if (isAuthenticated) {
      if (!userId)
        getUserInfo();

      if (!playingTrack) 
        getPlayerInfo();

    } 
  }, [token, isAuthenticated, playingTrack]);

  return (
    <div className="App">
      <div className="container gradient-border" id="main">
        {isAuthenticated ? (
          <Player userId={userId} track={playingTrack} />
        ) : (
          <LogInButton />
        )}
      </div>
    </div>
  );
}


function Player({ track }) {
  const artistList = track?.artists.map(artist => artist?.name)?.join(", ");
  return (
    <div id="player">
      <h4>Now playing:</h4>
      <h3>
        <span id="songName">{track?.name}</span> - 
        <span id="artistName">{track ? artistList : ""}</span>
      </h3>
    </div>
  )
}

function LogInButton() {
  return (
    <a href="http://localhost:8888/login" className="btn-login btn">Log in with Spotify</a>
  )
}

export default App;
