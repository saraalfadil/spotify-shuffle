import { useState } from 'react';
import ShuffleButton from './ShuffleButton';
import ShuffleToggle from './ShuffleToggle';
import PlaylistGroup from './PlaylistGroup';

const ShuffleOptions = function({ playlists, refreshNowPlaying, refreshPlaylists }) {

	const [ myPlaylistsOnly, setMyPlaylistsOnly ] = useState(true);
	const [ includeLikedTracks, setIncludeLikedTracks ] = useState(true);
	const [ choosePlaylists, setChoosePlaylists ] = useState(false);

	const toggleMyPlaylistsOnly = () => {
		setMyPlaylistsOnly(!myPlaylistsOnly);
		refreshPlaylists(myPlaylistsOnly);
	};

	const toggleIncludeLikedTracks = () => {
		setIncludeLikedTracks(!includeLikedTracks);
	};

	const toggleChoosePlaylists = () => {
		setChoosePlaylists(!choosePlaylists);
	};

	return (
		<div id="settingsContainer">
			<ShuffleButton myPlaylistsOnly={myPlaylistsOnly} includeLikedTracks={includeLikedTracks} refreshNowPlaying={refreshNowPlaying} />

			<div className="options-group">
				<ShuffleToggle label="My playlists only" value={myPlaylistsOnly} onChange={toggleMyPlaylistsOnly} />

				<ShuffleToggle label="Include liked tracks" value={includeLikedTracks} onChange={toggleIncludeLikedTracks} />

				<ShuffleToggle label="Choose playlists only" value={choosePlaylists} onChange={toggleChoosePlaylists} />
      		</div>

			{choosePlaylists && 
				<PlaylistGroup playlists={playlists} />
			}

    	</div>
   )
}

export default ShuffleOptions;