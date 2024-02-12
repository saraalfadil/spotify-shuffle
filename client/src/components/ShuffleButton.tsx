import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getShuffledTracks, playTracks } from '../utils.ts';
import { default as loadingIcon } from '../assets/loading.svg';
import { default as shuffleIcon } from '../assets/shuffle.svg';

const ShuffleButton = function({ myPlaylistsOnly, includeLikedTracks, refreshNowPlaying }: { myPlaylistsOnly: boolean, includeLikedTracks: boolean, refreshNowPlaying: Function }) {

  	const [ isLoading, setIsLoading ] = useState(false);
	const { accessToken, userId } = useAuth();

  	const shuffle = async() => {

		setIsLoading(true);

		// Fetch and play shuffled tracks
		const allTracks = await getShuffledTracks({ accessToken, userId, myPlaylistsOnly, includeLikedTracks });
		if (allTracks) 
			await playTracks({ accessToken, allTracks });

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