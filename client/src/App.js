import { useState, useEffect } from 'react';
import './App.css';

const App = function() {
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ userId, setUserId ] = useState("");
  const [ error, setError ] = useState("");

  // Get user information
  const getUserInfo = async (accessToken) => {

    await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    })
    .then((response) => response.json())
    .then((data) => setUserId(data.id))
    .catch((error) => setError(error) );

  }

  // Grab access token
  useEffect(() => {
    const queryString = window.location.search;
    const accessToken = new URLSearchParams(queryString).get('access_token');
    if(accessToken) {
      setLoggedIn(true);
      getUserInfo(accessToken);
    }
  }, []);

  return (
    <div className="App">
      <div className="container gradient-border" id="main">
        {loggedIn ? (
          <Player />
        ) : (
          <LogInButton />
        )}
      </div>
    </div>
  );
}


function Player() {
  return (
    <div id="player" className="row">
      <h4>Now playing:</h4>
      <h3><span id="songName"></span> - <span id="artistName"></span></h3>
    </div>
  )
}

function LogInButton() {
  return (
    <a href="http://localhost:8888/login" className="btn-login btn">Log in with Spotify</a>
  )
}

export default App;
