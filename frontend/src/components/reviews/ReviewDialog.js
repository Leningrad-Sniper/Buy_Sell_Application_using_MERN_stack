import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Rating,
    Box,
    Typography,
    Alert
} from '@mui/material';
import api from '../../utils/api';

const ReviewDialog = ({ open, onClose, orderId, sellerName }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!comment.trim()) {
            setError('Please enter a comment');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/reviews', {
                orderId,
                rating,
                comment
            });
            onClose(true); // true indicates successful submission
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Rate Your Experience with {sellerName}</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box sx={{ mb: 2, mt: 1 }}>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue)}
                        size="large"
                    />
                </Box>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with the seller..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    disabled={submitting}
                >
                    Submit Review
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewDialog; 