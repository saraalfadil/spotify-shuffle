import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PlaylistGroup = function ({ playlists, selectedPlaylists, setSelectedPlaylists }: { playlists: Array<any>, selectedPlaylists: Set<string>, setSelectedPlaylists: Function }) {
  const { userId } = useAuth();

  useEffect(() => {
    const allHrefs = playlists
      .map((p: any) => p?.tracks?.href)
      .filter(Boolean) as string[];
    setSelectedPlaylists(new Set(allHrefs));
  }, [playlists]);

  const allHrefs = playlists.map(p => p?.tracks?.href).filter(Boolean) as string[];
  const selectAll = allHrefs.length > 0 && selectedPlaylists.size === allHrefs.length;

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPlaylists(new Set());
    } else {
      setSelectedPlaylists(new Set(allHrefs));
    }
  };

  const togglePlaylist = (href: string) => {
    setSelectedPlaylists((prev: Set<string>) => {
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
                const image = playlist?.images?.at(-1)?.url ?? playlist?.images?.[0]?.url;

                return (
                  <li key={href}>
                    <input
                      type="checkbox"
                      className="playlist-checkbox"
                      name="playlist[]"
                      value={href}
                      checked={selectedPlaylists.has(href)}
                      onChange={() => togglePlaylist(href)}
                    />
                    {image && <img src={image} alt="" className="playlist-thumbnail" />}
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
