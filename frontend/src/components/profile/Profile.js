import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        age: user?.age || '',
        contactNumber: user?.contactNumber || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
                setFormData({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    age: response.data.age || '',
                    contactNumber: response.data.contactNumber || ''
                });
            } catch (err) {
                setError('Error fetching profile data');
            }
        };
        fetchUserData();
    }, [setUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', formData);
            setUser(response.data);
            setSuccess('Profile updated successfully');
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    My Profile
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        margin="normal"
                        disabled={!editing}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        margin="normal"
                        disabled={!editing}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={user?.email}
                        margin="normal"
                        disabled
                    />
                    <TextField
                        fullWidth
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        margin="normal"
                        disabled={!editing}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        margin="normal"
                        disabled={!editing}
                        required
                    />
                    {editing ? (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => setEditing(true)}
                        >
                            Edit Profile
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile; 