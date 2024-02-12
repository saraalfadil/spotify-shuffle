import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserInfo } from '../utils.ts';

const AuthContext = createContext({
    isAuthenticated: false,
    accessToken: '',
	userId: ''
});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: ReactNode}) => {
	const [ userId, setUserId ] = useState('');

    const [isAuthenticated, setAuthenticated] = useState(() => {
        const token = localStorage.getItem('accessToken') || '';
        return token !== null;
    });

    const [accessToken, setAccessToken] = useState(() => {
        const token = localStorage.getItem("accessToken") || '';
        return JSON.parse(token);
    });

	const queryString = window.location.search;
	const token = new URLSearchParams(queryString).get('access_token') || '';

	useEffect(() => {
		const logIn = async() => {
			if (token.length > 0) {
				localStorage.setItem('accessToken', JSON.stringify(token));
				setAccessToken(token);
				setAuthenticated(true);

				if (!userId) {
					let user = await getUserInfo({ accessToken: token });
					setUserId(user.id);
				}
	
			}
		}
		logIn();
  	}, [token, userId]);

	return (
		<AuthContext.Provider value={{ isAuthenticated, accessToken, userId }}>
			{children}
		</AuthContext.Provider>
	);
};