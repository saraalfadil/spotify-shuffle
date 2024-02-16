import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getShuffledTracks, playTracks } from '../utils.ts';
import { default as loadingIcon } from '../assets/loading.svg';
import { default as shuffleIcon } from '../assets/shuffle.svg';

interface ShuffleButtonProps {
	myPlaylistsOnly: boolean,
	includeLikedTracks: boolean,
	refreshNowPlaying: Function
}

const ShuffleButton = function({ myPlaylistsOnly, includeLikedTracks, refreshNowPlaying }: ShuffleButtonProps ) {

  	const [ isLoading, setIsLoading ] = useState(false);
	const { accessToken, userId } = useAuth();

  	const shuffle = async() => {

		setIsLoading(true);

		// Fetch shuffled tracks
		const allTracks = await getShuffledTracks({ accessToken, userId, myPlaylistsOnly, includeLikedTracks });

		// Play shuffled tracks
		if (allTracks) 
			await playTracks({ accessToken, allTracks });
		
		// Refresh now playing song
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