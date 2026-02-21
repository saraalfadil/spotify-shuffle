This is a Node.js app that provides a cross playlist shuffle feature for Spotify. This project uses the Implicit Grant OAuth 2.0 flow for authenticating against the Spotify Web API.

![App Screenshot](https://github.com/saraalfadil/spotify-shuffle/blob/develop/client/public/screenshot.png?raw=true)

## Installation
```
npm install
```

### Register app with Spotify
1. Register app with Spotify for Developers and retrieve credentials from Dashboard
2. Replace the variables `CLIENT_ID` and `CLIENT_SECRET` in the `.env` file with the values from the Developer dashboard

## Running the app
1. Start backend
```
node app.js
```
2. Start frontend
```
npm start
```

3. Open `http://localhost:3000` in a browser
