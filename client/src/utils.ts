// Get user information
export const getUserInfo = async (accessToken) => {
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
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
// Get information about the currently playing track
export const getPlayerInfo = async (accessToken) => {
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
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Pull a list of all my playlists
export const getPlaylists = async (accessToken, userId) => {
  try {
    let queryParams = new URLSearchParams({
      'access_token': accessToken,
      'user_id': userId
    });

    const response = await fetch('http://localhost:8888/playlists/?' + queryParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response) {
      throw new Error('Failed to fetch playlist information');
    }
    const data = await response.json();
    return data.playlists;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Fetch shuffled tracks
export const getShuffledTracks = async (accessToken, userId, myPlaylistsOnly, includeLikedTracks) => {

  try {

    let queryParams = new URLSearchParams({
      'access_token': accessToken,
      'user_id': userId,
      'include_all_playlists': myPlaylistsOnly,
      'include_liked_tracks': includeLikedTracks,
      //'filter_playlists': filter_playlists
    });

    const response = await fetch('http://localhost:8888/shuffle/?' + queryParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response) {
      throw new Error('Failed to fetch shuffle information');
    }
    const data = await response.json();
    return data.all_tracks;
  } catch (error) {
    throw new Error(error.message);
  }
}
    
// Initiate playback on the active user device
export const playTracks = async (accessToken, tracks) => {
  try {

    const response = await fetch('https://api.spotify.com/v1/me/player/play/', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          uris: tracks
      }),
    });
    if (!response) {
      throw new Error('Failed to fetch player information');
    }

  } catch (error) {
    throw new Error(error.message);
  }
}