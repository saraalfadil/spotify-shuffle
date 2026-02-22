const Player = function({ track }) {
	return (
		<div id="player">
			<h4>Now playing:</h4>
			<h3>
			<span id="songName">{track?.name}</span> 
			<span className="songDivider">-</span>   
			<span id="artistName">
				{track ? track?.artists.map(artist => artist?.name)?.join(", ") : ""}
			</span>
			</h3>
		</div>
  	)
}

export default Player;