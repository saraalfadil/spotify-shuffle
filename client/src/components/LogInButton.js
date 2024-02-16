const SITE_URL = process.env.REACT_APP_SITE_URL;

const LogInButton = function () {
  return (
    <a href={`${SITE_URL}/login`} className="btn-login btn">Log in with Spotify</a>
  )
}

export default LogInButton;