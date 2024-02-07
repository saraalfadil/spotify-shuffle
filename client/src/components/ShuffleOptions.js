import { useState } from 'react';
import ShuffleButton from './ShuffleButton';
import PlaylistGroup from './PlaylistGroup';

const ShuffleOptions = function({ accessToken, userId, playlists, refreshNowPlaying }) {

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
			<ShuffleButton accessToken={accessToken} userId={userId} myPlaylistsOnly={myPlaylistsOnly} includeLikedTracks={includeLikedTracks} refreshNowPlaying={refreshNowPlaying} />

			<div className="options-group">
				<div>
					<p id="myPlaylistsOnlyLabel" className="options-label">My playlists only</p>
					<div className="options-checkbox"> 
						<p id="myPlaylistsOnlyValue">{myPlaylistsOnly ? "ON" : "OFF"}</p>
						<label className="switch">
							<input 
								type="checkbox" 
								id="myPlaylistsOnlyCheckbox" 
								aria-labelledby="myPlaylistsOnlyLabel" 
								value="ON" 
								checked={myPlaylistsOnly}
								onChange={toggleMyPlaylistsOnly}
								/>
							<span className="slider"></span>
						</label>
					</div>
				</div>

				<div>
					<p id="includeLikedTracksLabel" className="options-label">Include liked tracks</p>
					<div className="options-checkbox">
						<p id="includeLikedTracksValue">{includeLikedTracks ? "ON" : "OFF"}</p>
						<label className="switch">
							<input 
								type="checkbox" 
								id="includeLikedTracksCheckbox" 
								aria-labelledby="includeLikedTracksLabel" 
								value="ON" 
								checked={includeLikedTracks}
								onChange={toggleIncludeLikedTracks}
								/>
								<span className="slider"></span>
						</label>
					</div>
				</div>

				<div>
					<p id="choosePlaylistsLabel" className="options-label">Choose playlists</p>
					<div className="options-checkbox">
						<p id="choosePlaylistsValue">{choosePlaylists ? "ON" : "OFF"}</p>
							<label className="switch">
							<input 
									type="checkbox" 
									id="choosePlaylistsCheckbox"
									aria-labelledby="choosePlaylistsLabel"
									checked={choosePlaylists}
									onChange={toggleChoosePlaylists}
							/>
							<span className="slider"></span>
							</label>
					</div>
				</div>

      </div>

			{choosePlaylists && 
				<PlaylistGroup userId={userId} playlists={playlists} />
			}

    </div>
  )
}

export default ShuffleOptions;