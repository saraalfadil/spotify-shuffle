import { useState } from 'react';
import ShuffleButton from './ShuffleButton';
import PlaylistGroup from './PlaylistGroup';

const ShuffleOptions = function({ playlists, refreshNowPlaying }) {

	const [myPlaylistsOnly, setMyPlaylistsOnly] = useState(true);
	const [includeLikedTracks, setIncludeLikedTracks] = useState(true);
	const [choosePlaylists, setChoosePlaylists] = useState(false);

	const toggleMyPlaylistsOnly = () => {
		setMyPlaylistsOnly(!myPlaylistsOnly);
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

const ShuffleToggle = function({ label, value, onChange }) {
	return (
		<div>
			<p id="myPlaylistsOnlyLabel" className="options-label">{label}</p>
			<div className="options-checkbox"> 
				<p id="myPlaylistsOnlyValue">{value ? "ON" : "OFF"}</p>
				<label className="switch">
					<input 
						type="checkbox" 
						id="myPlaylistsOnlyCheckbox" 
						aria-labelledby="myPlaylistsOnlyLabel" 
						value="ON" 
						checked={value}
						onChange={onChange}
						/>
					<span className="slider"></span>
				</label>
			</div>
		</div>
	)
}