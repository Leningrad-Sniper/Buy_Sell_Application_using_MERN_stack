import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    MenuItem,
    IconButton,
    Card,
    CardMedia,
} from '@mui/material';
import { PhotoCamera, Clear } from '@mui/icons-material';
import api from '../../utils/api';

const AddItem = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const categories = [
        'books',
        'electronics',
        'clothing',
        'kitchenware',
        'sports',
        'furniture',
        'stationery',
        'accessories',
        'others'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            
            // Ensure price is a number
            const numericPrice = Number(formData.price);
            if (isNaN(numericPrice)) {
                setError('Price must be a number');
                return;
            }
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            
            // Append image if exists
            if (image) {
                formDataToSend.append('image', image);
            }

            const response = await api.post('/items', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                navigate('/');
            }
        } catch (err) {
            console.error('Error creating item:', err);
            setError(err.response?.data?.message || 'Error creating item');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Add New Item
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        {imagePreview ? (
                            <Card sx={{ position: 'relative', maxWidth: 345, margin: 'auto' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={imagePreview}
                                    alt="Item preview"
                                    sx={{ objectFit: 'contain' }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'background.paper'
                                    }}
                                    onClick={handleRemoveImage}
                                >
                                    <Clear />
                                </IconButton>
                            </Card>
                        ) : (
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<PhotoCamera />}
                                sx={{ mb: 2 }}
                            >
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                        )}
                    </Box>

                    <TextField
                        fullWidth
                        label="Item Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        fullWidth
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Add Item
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddItem; 