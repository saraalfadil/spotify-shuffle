import { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { getShuffledTracks, playTracks } from '../utils.ts';
import { default as loadingIcon } from '../assets/loading.svg';
import { default as shuffleIcon } from '../assets/shuffle.svg';

const ShuffleButton = function({ myPlaylistsOnly, includeLikedTracks, refreshNowPlaying }) {

  const [ isLoading, setIsLoading ] = useState(false);
	const { accessToken, userId } = useAuth();

  const shuffle = async() => {

    setIsLoading(true);

    // Fetch and play shuffled tracks
    const all_tracks = await getShuffledTracks(accessToken, userId, myPlaylistsOnly, includeLikedTracks);
    if (all_tracks) 
        await playTracks(accessToken, all_tracks);

    await refreshNowPlaying();

    setIsLoading(false);

  }

  return (
    <button 
      className="btn btn-shuffle btn-gradient" 
      id="shuffle" 
      type="button" 
      onClick={shuffle}
      >
      {isLoading ? (
        <span id="loading" className="spinner-icon fa-beat" role="status" aria-hidden="true">
          <img src={loadingIcon} alt="loading"/>
        </span>
      ) : (
        <span id="shuffleIcon" className="shuffle-icon">
          <img src={shuffleIcon} alt="shuffle" />
        </span>
      )}
      <span id="shuffleText">{isLoading ? "Shuffling" : "Shuffle"}</span>
    </button>
  )
}

export default ShuffleButton;