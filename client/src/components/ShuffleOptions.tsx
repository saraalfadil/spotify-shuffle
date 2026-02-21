import React, { useState } from 'react';
import ShuffleButton from './ShuffleButton';
import ShuffleToggle from './ShuffleToggle';
import PlaylistGroup from './PlaylistGroup';

interface ShuffleOptionsProps {
	playlists: Array<string>, 
	refreshNowPlaying: Function, 
	refreshPlaylists: Function
}

const ShuffleOptions = function({ playlists, refreshNowPlaying, refreshPlaylists }: ShuffleOptionsProps) {

	const [ myPlaylistsOnly, setMyPlaylistsOnly ] = useState(true);
	const [ includeLikedTracks, setIncludeLikedTracks ] = useState(true);
	const [ choosePlaylists, setChoosePlaylists ] = useState(false);
	const [ selectedPlaylists, setSelectedPlaylists ] = useState<Set<string>>(new Set());

	const toggleMyPlaylistsOnly = () => {
		setMyPlaylistsOnly(!myPlaylistsOnly);
		refreshPlaylists(!myPlaylistsOnly);
	};

	const toggleIncludeLikedTracks = () => {
		setIncludeLikedTracks(!includeLikedTracks);
	};

	const toggleChoosePlaylists = () => {
		setChoosePlaylists(!choosePlaylists);
	};

	return (
		<div id="settingsContainer">
			<ShuffleButton 
				myPlaylistsOnly={myPlaylistsOnly} 
				includeLikedTracks={includeLikedTracks} 
				refreshNowPlaying={refreshNowPlaying} 
				choosePlaylists={choosePlaylists} 
				selectedPlaylists={selectedPlaylists}
			/>

			<div className="options-group">
				<ShuffleToggle label="My playlists only" value={myPlaylistsOnly} onChange={toggleMyPlaylistsOnly} />

				<ShuffleToggle label="Include liked tracks" value={includeLikedTracks} onChange={toggleIncludeLikedTracks} />

				<ShuffleToggle label="Choose playlists only" value={choosePlaylists} onChange={toggleChoosePlaylists} />
      		</div>

			{choosePlaylists && 
				<PlaylistGroup 
					playlists={playlists} 
					selectedPlaylists={selectedPlaylists} 
					setSelectedPlaylists={setSelectedPlaylists} 
				/>
			}

    	</div>
   )
}

export default ShuffleOptions;