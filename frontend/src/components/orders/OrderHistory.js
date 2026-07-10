import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Box,
    List,
    ListItem,
    ListItemText,
    Chip,
    Alert,
    Button
} from '@mui/material';
import api from '../../utils/api';
import ReviewDialog from '../reviews/ReviewDialog';

const OrderHistory = () => {
    const [tab, setTab] = useState(0);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [reviewOrder, setReviewOrder] = useState(null);
    const [showReviewDialog, setShowReviewDialog] = useState(false);

    const fetchOrders = React.useCallback(async () => {
        try {
            const response = await api.get(tab === 0 ? '/orders/buyer' : '/orders/seller');
            setOrders(response.data);
        } catch (error) {
            setError('Error fetching orders');
        }
    }, [tab]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'completed': return 'success';
            case 'sold': return 'info';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const handleReviewComplete = (success) => {
        if (success) {
            fetchOrders();
        }
        setShowReviewDialog(false);
        setReviewOrder(null);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Order History
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper elevation={3}>
                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    centered
                >
                    <Tab label="Purchases" />
                    <Tab label="Sales" />
                </Tabs>
                <List>
                    {orders.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No orders found" />
                        </ListItem>
                    ) : (
                        orders.map((order) => (
                            <ListItem key={order._id}>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="subtitle1">
                                                {order.item.name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                                (Transaction ID: {order._id})
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2">
                                                Amount: ₹{order.amount}
                                            </Typography>
                                            {tab === 0 ? (
                                                <>
                                                    <Typography variant="caption">
                                                        Seller ID: {order.seller._id}
                                                        <br />
                                                        Seller: {order.seller.firstName} {order.seller.lastName}
                                                    </Typography>
                                                    {order.status === 'completed' && !order.reviewed && (
                                                        <Button
                                                            size="small"
                                                            onClick={() => {
                                                                setReviewOrder(order);
                                                                setShowReviewDialog(true);
                                                            }}
                                                            sx={{ mt: 1 }}
                                                        >
                                                            Write Review
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <Typography variant="caption">
                                                    Buyer ID: {order.buyer._id}
                                                    <br />
                                                    Buyer: {order.buyer.firstName} {order.buyer.lastName}
                                                </Typography>
                                            )}
                                            {order.status === 'pending' && tab === 0 && (
                                                <Typography variant="caption" color="primary" display="block">
                                                    OTP: {order.otp}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                />
                                <Chip
                                    label={order.status}
                                    color={getStatusColor(order.status)}
                                    size="small"
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
            {showReviewDialog && reviewOrder && (
                <ReviewDialog
                    open={showReviewDialog}
                    onClose={handleReviewComplete}
                    orderId={reviewOrder._id}
                    sellerName={`${reviewOrder.seller.firstName} ${reviewOrder.seller.lastName}`}
                />
            )}
        </Container>
    );
};

export default OrderHistory; 