import { useState, useEffect } from 'react';
import './App.css';

const App = function() {
  const [ loggedIn, setLoggedIn ] = useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    const accessToken = new URLSearchParams(queryString).get('code');
    if(accessToken) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <div className="container gradient-border" id="main">
        <header className="App-header">
          <p>
            Spotify shuffle app
          </p>
        </header>

        {loggedIn ? (
          <p>
            Logged In
          </p>
        ) : (
          <a href="http://localhost:8888/login" className="btn-login btn">Log in with Spotify</a>
        )}
      </div>
    </div>
  );
}

export default App;
