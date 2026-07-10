import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import queryString from 'query-string';
import api from '../../utils/api';

const CASCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    useEffect(() => {
        const handleCASCallback = async () => {
            const { token } = queryString.parse(location.search);
            
            if (token) {
                try {
                    // Store token
                    localStorage.setItem('token', token);
                    
                    // Set token in axios defaults
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Get user data
                    const response = await api.get('/users/profile');
                    const userData = response.data;
                    
                    // Update auth context
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    // Redirect to home
                    navigate('/');
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token');
                    navigate('/login?error=Failed to get user data');
                }
            } else {
                navigate('/login?error=No token received');
            }
        };

        handleCASCallback();
    }, [location, navigate, setUser]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            <h2>Processing CAS login...</h2>
        </div>
    );
};

export default CASCallback; 