import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Box,
    Chip,
    Skeleton,
    Card,
    CardMedia,
    Divider,
    Stack,
    Button,
    IconButton,
    Avatar
} from '@mui/material';
import {
    ArrowBack,
    Home,
    Person,
    AddShoppingCart
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../../utils/api';
import { getCategoryIcon } from './categoryIcons';
import { useAuth } from '../../context/AuthContext';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    const theme = useTheme();
    const { user } = useAuth();
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await api.get(`/items/${id}`);
                setItem(response.data);
            } catch (err) {
                setError('Error loading item details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            await api.post('/cart/add', { itemId: id });
            setCartMessage('Item added to cart successfully!');
        } catch (err) {
            setCartMessage(err.response?.data?.message || 'Failed to add item to cart');
        } finally {
            setAddingToCart(false);
            setTimeout(() => setCartMessage(''), 3000); // Clear message after 3 seconds
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rectangular" height={400} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="text" height={60} />
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={100} />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    if (error || !item) {
        return (
            <Container>
                <Typography color="error" align="center">
                    {error || 'Item not found'}
                </Typography>
            </Container>
        );
    }

    const imageUrl = imageError || !item.image 
        ? null 
        : `http://localhost:5000${item.image}`;

    const CategoryIcon = getCategoryIcon(item?.category || 'others');

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Navigation Buttons */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <IconButton onClick={handleBack} color="primary">
                    <ArrowBack />
                </IconButton>
                <IconButton onClick={handleHome} color="primary">
                    <Home />
                </IconButton>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card elevation={2}>
                        {imageUrl ? (
                            <CardMedia
                                component="img"
                                image={imageUrl}
                                alt={item.name}
                                onError={() => setImageError(true)}
                                sx={{
                                    height: 400,
                                    objectFit: 'contain',
                                    bgcolor: theme.palette.action.hover,
                                    p: 2
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: theme.palette.action.hover,
                                }}
                            >
                                {CategoryIcon && <CategoryIcon sx={{ fontSize: 100, color: theme.palette.text.secondary }} />}
                            </Box>
                        )}
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography variant="h3" color="primary" gutterBottom>
                                ₹{item.price.toLocaleString()}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Description
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {item.description}
                            </Typography>
                        </Box>

                        <Box>
                            <Chip 
                                icon={CategoryIcon && <CategoryIcon />}
                                label={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                color="primary"
                                variant="outlined"
                            />
                        </Box>

                        {user && user._id !== item.seller._id && (
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddShoppingCart />}
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    fullWidth
                                >
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </Button>
                                {cartMessage && (
                                    <Typography 
                                        color={cartMessage.includes('success') ? 'success.main' : 'error.main'}
                                        sx={{ mt: 1, textAlign: 'center' }}
                                    >
                                        {cartMessage}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        <Box sx={{ 
                            p: 2, 
                            bgcolor: theme.palette.background.default,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                <Person />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1">
                                    Seller: {item.seller.firstName} {item.seller.lastName}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Contact: {item.seller.email}
                                </Typography>
                            </Box>
                            <Button 
                                variant="outlined"
                                startIcon={<Person />}
                                component={Link}
                                to={`/profile/${item.seller._id}`}
                                sx={{ ml: 'auto' }}
                            >
                                View Profile
                            </Button>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ItemDetail; 