import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Set the token in axios defaults
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(user);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };

    const logout = async () => {
        try {
            // First, logout from our application
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            delete api.defaults.headers.common['Authorization'];

            // Then, logout from CAS
            // Get the current URL for service parameter
            const currentUrl = encodeURIComponent(`${window.location.origin}/login`);
            
            // Redirect to CAS logout URL
            window.location.href = `https://login.iiit.ac.in/cas/logout?service=${currentUrl}`;
        } catch (error) {
            console.error('Logout error:', error);
            // Even if CAS logout fails, ensure local logout is complete
            navigate('/login');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 