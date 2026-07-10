import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    CardActionArea,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { getCategoryIcon } from './categoryIcons';

const ItemCard = ({ item }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setIsLoading(false);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const imageUrl = imageError || !item.image 
        ? null // We'll show icon instead
        : `http://localhost:5000${item.image}`;

    const CategoryIcon = getCategoryIcon(item.category);

    return (
        <Card 
            elevation={2}
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                }
            }}
        >
            <CardActionArea 
                onClick={() => navigate(`/items/${item._id}`)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                {imageUrl ? (
                    <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl}
                        alt={item.name}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        sx={{
                            objectFit: 'contain',
                            backgroundColor: theme.palette.action.hover,
                            opacity: isLoading ? 0.5 : 1,
                            transition: 'opacity 0.3s',
                            p: 1
                        }}
                    />
                ) : (
                    !imageUrl && CategoryIcon && (
                        <Box
                            sx={{
                                height: 200,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            <CategoryIcon sx={{ fontSize: 64 }} />
                        </Box>
                    )
                )}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                        variant="h6" 
                        component="h2" 
                        gutterBottom
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2,
                            height: '2.4em'
                        }}
                    >
                        {item.name}
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 'auto' }}>
                        <Typography 
                            variant="h5" 
                            color="primary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            ₹{item.price.toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                icon={CategoryIcon && <CategoryIcon />}
                                label={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                            <Chip 
                                label={`By ${item.seller.firstName}`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {item.description}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ItemCard; 