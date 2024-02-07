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

export default ShuffleToggle;