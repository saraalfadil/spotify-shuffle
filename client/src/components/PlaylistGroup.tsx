import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PlaylistGroup = function ({ playlists }: { playlists: Array<any>}) {
  const { userId } = useAuth();
  const [checkedPlaylists, setCheckedPlaylists] = useState<Set<string>>(new Set());

  useEffect(() => {
    const allHrefs = playlists
      .map((p: any) => p?.tracks?.href)
      .filter(Boolean) as string[];
    setCheckedPlaylists(new Set(allHrefs));
  }, [playlists]);

  const allHrefs = playlists.map(p => p?.tracks?.href).filter(Boolean) as string[];
  const selectAll = allHrefs.length > 0 && checkedPlaylists.size === allHrefs.length;

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedPlaylists(new Set());
    } else {
      setCheckedPlaylists(new Set(allHrefs));
    }
  };

  const togglePlaylist = (href: string) => {
    setCheckedPlaylists(prev => {
      const next = new Set(prev);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
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
                const href = tracks?.href ?? '';

                return (
                  <li key={href}>
                    <input
                      type="checkbox"
                      className="playlist-checkbox"
                      name="playlist[]"
                      value={href}
                      checked={checkedPlaylists.has(href)}
                      onChange={() => togglePlaylist(href)}
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
