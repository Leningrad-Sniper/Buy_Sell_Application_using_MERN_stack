import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    Avatar,
    Divider,
    IconButton,
    Card,
    CardContent,
    Rating,
    List,
    ListItem,
    ListItemText,
    Chip,
    Stack,
    Button
} from '@mui/material';
import {
    Person,
    Email,
    Phone,
    ArrowBack,
    Star,
    LocalShipping,
    ShoppingBag,
    DateRange
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../../utils/api';
import ItemCard from '../items/ItemCard';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [userItems, setUserItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userResponse = await api.get(`/users/${userId}`);
                setUser(userResponse.data);
                // Items are now included in the user response
                setUserItems(userResponse.data.items || []);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.response?.data?.message || 'Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (error || !user) {
        return (
            <Container>
                <Typography color="error">{error || 'User not found'}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} color="primary">
                    <ArrowBack />
                </IconButton>
            </Box>

            <Grid container spacing={4}>
                {/* User Info Section */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: theme.palette.primary.main,
                                    mb: 2
                                }}
                            >
                                <Person sx={{ fontSize: 60 }} />
                            </Avatar>
                            <Typography variant="h5" gutterBottom>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Chip 
                                icon={<Star />} 
                                label={`${user.rating || 4.5} Rating`}
                                color="primary"
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary="Email"
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Email fontSize="small" />
                                            {user.email}
                                        </Box>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Contact"
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Phone fontSize="small" />
                                            {user.contactNumber || 'Not provided'}
                                        </Box>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Member Since"
                                    secondary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <DateRange fontSize="small" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </List>

                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <ShoppingBag color="primary" />
                                            <Typography variant="h6">
                                                {userItems.length}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Items Listed
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <LocalShipping color="primary" />
                                            <Typography variant="h6">
                                                {user.completedSales || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Sales
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Reviews Section */}
                    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Reviews
                        </Typography>
                        {user.reviews && user.reviews.length > 0 ? (
                            <Stack spacing={2}>
                                {user.reviews.map((review, index) => (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Rating value={review.rating} readOnly size="small" />
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(review.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            {review.comment}
                                        </Typography>
                                        {index < user.reviews.length - 1 && <Divider sx={{ my: 1 }} />}
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Typography color="text.secondary">
                                No reviews yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* User Items Section */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Items for Sale
                        </Typography>
                        <Grid container spacing={3}>
                            {userItems.length > 0 ? (
                                userItems.map((item) => (
                                    <Grid item xs={12} sm={6} key={item._id}>
                                        <ItemCard item={item} />
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography color="text.secondary" align="center">
                                        No items listed
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default UserProfile; 