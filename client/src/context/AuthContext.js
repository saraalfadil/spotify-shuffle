import { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from '../utils.ts';

const AuthContext = createContext({
    isAuthenticated: false,
    accessToken: null
});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
	const [ userId, setUserId ] = useState(null);

    const [isAuthenticated, setAuthenticated] = useState(() => {
        const token = localStorage.getItem('accessToken');
        return token !== null;
    });

    const [accessToken, setAccessToken] = useState(() => {
        const token = localStorage.getItem("accessToken");
        return JSON.parse(token);
    });

	const queryString = window.location.search;
	const token = new URLSearchParams(queryString).get('access_token');

	useEffect(() => {
		const logIn = async() => {
			if (token) {
				localStorage.setItem('accessToken', JSON.stringify(token));
				setAccessToken(token);
				setAuthenticated(true);

				if (!userId) {
					let user = await getUserInfo(token);
					setUserId(user.id);
				}
	
			}
		}
		logIn();
  	}, [isAuthenticated, token, userId]);

	return (
		<AuthContext.Provider value={{ isAuthenticated, accessToken }}>
			{children}
		</AuthContext.Provider>
	);
};