import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
    Box,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import api from '../../utils/api';

const DeliverItems = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [otp, setOtp] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchOrders = React.useCallback(async () => {
        try {
            const response = await api.get('/orders/seller');
            setOrders(response.data.filter(order => order.status === 'pending'));
        } catch (error) {
            setError('Error fetching orders');
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleComplete = async () => {
        try {
            await api.post('/orders/complete', {
                orderId: selectedOrder._id,
                otp: otp
            });
            setSuccess('Order completed successfully');
            setDialogOpen(false);
            setOtp('');
            fetchOrders();
        } catch (error) {
            setError(error.response?.data?.message || 'Error completing order');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Pending Deliveries
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Paper elevation={3}>
                <List>
                    {orders.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No pending deliveries" />
                        </ListItem>
                    ) : (
                        orders.map((order) => (
                            <ListItem key={order._id}>
                                <ListItemText
                                    primary={order.item.name}
                                    secondary={
                                        <Box>
                                            <Typography variant="body2">
                                                Amount: ₹{order.amount}
                                            </Typography>
                                            <Typography variant="caption">
                                                Buyer: {order.buyer.firstName} {order.buyer.lastName}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setDialogOpen(true);
                                    }}
                                >
                                    Complete Delivery
                                </Button>
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Complete Delivery</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        margin="normal"
                        type="number"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleComplete} color="primary">
                        Complete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DeliverItems; 