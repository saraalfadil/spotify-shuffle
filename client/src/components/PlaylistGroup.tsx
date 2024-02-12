import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PlaylistGroup = function ({ playlists }: { playlists: Array<any>}) {
  const [selectAll, setSelectAll] = useState(true);
  const { userId } = useAuth();

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  return (
    <div id="playlistsContainer">
      <div className="playlist-section">
        <div className="select-playlists">
          <input 
            type="checkbox" 
            id="selectAllPlaylists" 
            className="playlist-checkbox" 
            checked={selectAll} 
            onChange={toggleSelectAll}
          /> 
          <label><strong>Select/Deselect all</strong></label>
        </div>
        <div style={{clear: 'both' }}>
          {playlists && playlists.length > 0 &&
            <ul id="playlists">
              {playlists.map(playlist => {
                
                let tracks = playlist?.tracks;
                let owner = playlist.owner;
                let ownedPlaylist = owner && owner.id === userId;
                let playlistNameClass = ownedPlaylist ? 'owned-playlist' : 'other-playlist';

                return (
                  <li key={tracks?.href}>
                    <input 
                      type="checkbox" 
                      className="playlist-checkbox" 
                      name="playlist[]" 
                      value={tracks?.href} 
                      checked={selectAll} 
                    />    
                    <span className={playlistNameClass}>{playlist?.name}</span>
                  </li>
                )
              })}
            </ul>
          }
        </div>
      </div>
    </div>
  )
}

export default PlaylistGroup;