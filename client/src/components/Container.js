const Container = function({ children }) {
	return (
		<div className="container gradient-border" id="main">
			{children}
		</div>
	)
}

export default Container;