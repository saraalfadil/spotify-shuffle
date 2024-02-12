const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1';
const SITE_URL = 'http://localhost:8888';

// Get user information
export const getUserInfo = async ({ accessToken } : { accessToken: string }) => {

	console.log("accessToken: ", accessToken);
	try {
		const response = await fetch(`${SPOTIFY_API_ENDPOINT}/me`, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			}
		});
		if (!response) {
			throw new Error('Failed to fetch user information');
		}
		return await response.json();
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : 'Error');
	}
}
// Get information about the currently playing track
export const getPlayerInfo = async ({ accessToken } : { accessToken: string}) => {
  try {
    const response = await fetch(`${SPOTIFY_API_ENDPOINT}/me/player`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    if (!response) {
      throw new Error('Failed to fetch player information');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error');
  }
}

// Pull a list of all my playlists
export const getPlaylists = async ({ accessToken, userId } : { accessToken: string, userId: string }) => {
  try {
    let queryParams = new URLSearchParams({
      'access_token': accessToken,
      'user_id': userId
    });

    const response = await fetch(`${SITE_URL}/playlists/?` + queryParams, {
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
    throw new Error(error instanceof Error ? error.message : 'Error');
  }
}

// Fetch shuffled tracks
interface ShuffleProps { 
	accessToken: string, 
	userId: string, 
	myPlaylistsOnly: boolean, 
	includeLikedTracks: boolean,
	//'filter_playlists': filter_playlists
}

export const getShuffledTracks = async (ShuffleProps: ShuffleProps) => {

  try {
    let queryParams = new URLSearchParams({
		...ShuffleProps, 
		myPlaylistsOnly: ShuffleProps.myPlaylistsOnly.toString(), 
		includeLikedTracks: ShuffleProps.includeLikedTracks.toString(),
	});

    const response = await fetch(`${SITE_URL}/shuffle/?` + queryParams, {
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
    throw new Error(error instanceof Error ? error.message : 'Error');
  }
}
    
// Initiate playback on the active user device
export const playTracks = async ({ accessToken, allTracks }: { accessToken: string, allTracks: Array<string> }) => {
  try {

    const response = await fetch(`${SPOTIFY_API_ENDPOINT}/me/player/play`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          uris: allTracks
      })
    });
    if (!response) {
      throw new Error('Failed to fetch player information');
    }

  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error');
  }
}