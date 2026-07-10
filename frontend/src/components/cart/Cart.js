import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Box,
    Divider,
    IconButton,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../utils/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCartItems(response.data);
        } catch (error) {
            setError('Error fetching cart items');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/cart/remove/${itemId}`);
            fetchCart();
        } catch (error) {
            setError('Error removing item from cart');
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await api.post('/orders/checkout');
            setCartItems([]);
            setSuccess('Order placed successfully! Check your orders for OTP.');
            // Store OTPs or show them to user
            console.log('Order OTPs:', response.data.otps);
        } catch (error) {
            setError(error.response?.data?.message || 'Error during checkout');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.item.price * item.quantity, 0);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                My Cart
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Paper elevation={3}>
                <List>
                    {cartItems.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="Your cart is empty" />
                        </ListItem>
                    ) : (
                        cartItems.map((cartItem) => (
                            <React.Fragment key={cartItem.item._id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton 
                                            edge="end" 
                                            onClick={() => handleRemoveItem(cartItem.item._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={cartItem.item.name}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2">
                                                    ₹{cartItem.item.price}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="caption">
                                                    Seller: {cartItem.item.seller.firstName} {cartItem.item.seller.lastName}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    )}
                </List>
                {cartItems.length > 0 && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Total: ₹{calculateTotal()}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCheckout}
                            fullWidth
                        >
                            Checkout
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Cart; 