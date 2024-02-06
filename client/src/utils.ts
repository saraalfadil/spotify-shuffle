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