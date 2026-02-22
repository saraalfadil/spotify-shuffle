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
        return token.length > 0;
    });

    const [accessToken, setAccessToken] = useState(() => {
        const raw = localStorage.getItem("accessToken") || '';     
        try { return JSON.parse(raw); } catch { return raw; }             
    });

	const queryString = window.location.search;
	const token = new URLSearchParams(queryString).get('access_token') || '';

	// Handle OAuth redirect — store the token from the URL
	useEffect(() => {
		if (token.length > 0) {
			localStorage.setItem('accessToken', token);
			setAccessToken(token);
			setAuthenticated(true);
		}
	}, [token]);

	// Fetch userId whenever we have a token but no userId
	useEffect(() => {
		const fetchUserId = async () => {
			if (accessToken && !userId) {
				try {
					let user = await getUserInfo({ accessToken });
					if (user?.id) setUserId(user.id);
				} catch (e) {}
			}
		};
		fetchUserId();
	}, [accessToken, userId]);

	return (
		<AuthContext.Provider value={{ isAuthenticated, accessToken, userId }}>
			{children}
		</AuthContext.Provider>
	);
};