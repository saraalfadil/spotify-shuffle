import { useState, useEffect } from 'react';
import { getUserInfo, getPlayerInfo } from './utils.ts';
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

    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {

    if (token)
      localStorage.setItem('accessToken', JSON.stringify(token));

    if (isAuthenticated) 
        getData();
    
  }, [token, isAuthenticated]);

  return (
    <div className="App">
      <div className="container gradient-border" id="main">
        {isAuthenticated ? (
          <>
          <Player userId={userId} track={playingTrack} />
          <div id="settingsContainer">
            <ShuffleButton/>
            <ShuffleOptions/>
          </div>
          </>
        ) : (
          <LogInButton />
        )}
      </div>
    </div>
  );
}


function Player({ track }) {
  return (
    <div id="player">
      <h4>Now playing:</h4>
      <h3>
        <span id="songName">{track?.name}</span> - 
        <span id="artistName">{track ? track?.artists.map(artist => artist?.name)?.join(", ") : ""}</span>
      </h3>
    </div>
  )
}

function ShuffleButton() {
  return (
    <button className="btn btn-shuffle btn-gradient" id="shuffle" type="button">
      <span id="loading" className="spinner-icon fa-beat" role="status" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25" height="25" fill="#ffffff">{/*<!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->*/}<path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
      </span>
      
      <span id="shuffleIcon" className="shuffle-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25" height="25" fill="#ffffff">{/*<!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->*/}<path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160H352c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96h32V64c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V416H352c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H96c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8h32V320c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"/></svg>
      </span>

      <span id="shuffleText">Shuffle</span>
    </button>
  )
}

function ShuffleOptions() {

  return (
    <div className="options-group">
      <div>
        <p id="myPlaylistsOnlyLabel" className="options-label">My playlists only</p>
        <div className="options-checkbox"> 
          <p id="myPlaylistsOnlyValue">ON</p>
          <label className="switch">
            <input type="checkbox" id="myPlaylistsOnlyCheckbox" aria-labelledby="myPlaylistsOnlyLabel" value="ON" checked="true"/>
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div>
        <p id="includeLikedTracksLabel" className="options-label">Include liked tracks</p>
        <div className="options-checkbox">
          <p id="includeLikedTracksValue">ON</p>
          <label className="switch">
            <input type="checkbox" id="includeLikedTracksCheckbox" aria-labelledby="includeLikedTracksLabel" value="ON" checked="true"/>
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div>
        <p id="choosePlaylistsLabel" className="options-label">Choose playlists</p>
        <div className="options-checkbox">
          <p id="choosePlaylistsValue">OFF</p>
            <label className="switch">
              <input type="checkbox" id="choosePlaylistsCheckbox" aria-labelledby="choosePlaylistsLabel"/>
              <span className="slider"></span>
            </label>
          </div>
      </div>
    </div>
  )
}

function PlaylistGroup() {
  return (
    <div id="playlistsContainer" style={{ display: 'none' }}>
      <div className="playlist-section">
        <div style={{float: 'left', marginLeft: '40px', marginBottom: '10px'}}>
          <input type="checkbox" id="selectAllPlaylists" className="playlist-checkbox" checked/> 
          <label><strong>Select/Deselect all</strong></label>
        </div>
        <div style={{clear: 'both' }}>
          <ul id="playlists"></ul>
        </div>
      </div>
    </div>
  )
}

function LogInButton() {
  return (
    <a href="http://localhost:8888/login" className="btn-login btn">Log in with Spotify</a>
  )
}

export default App;
