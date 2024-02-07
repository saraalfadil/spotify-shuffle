import { useState, useEffect } from 'react';
import { getUserInfo, getPlayerInfo } from '../utils.ts';

const LogInButton = function () {
  return (
    <a href="http://localhost:8888/login" className="btn-login btn">Log in with Spotify</a>
  )
}

export default LogInButton;