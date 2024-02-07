const PlaylistGroup = function () {
  return (
    <div id="playlistsContainer" style={{ display: 'none' }}>
      <div className="playlist-section">
        <div style={{float: 'left', marginLeft: '40px', marginBottom: '10px'}}>
          <input type="checkbox" id="selectAllPlaylists" className="playlist-checkbox" checked/> 
          <label><strong>Select/Deselect all</strong></label>
        </div>
        <div style={{clear: 'both' }}>
          <ul id="playlists"></ul>
        </div>
      </div>
    </div>
  )
}

export default PlaylistGroup;