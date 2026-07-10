import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    TextField, 
    Container, 
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    Paper,
    InputAdornment,
    CircularProgress,
    Checkbox,
    ListItemText,
    FormControlLabel,
    Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import api from '../../utils/api';
import ItemCard from './ItemCard';
import { useTheme } from '@mui/material/styles';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState('');
    const theme = useTheme();

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

    const fetchItems = React.useCallback(async () => {
        try {
            setLoading(true);
            let url = '/items/search?';
            if (searchQuery) url += `query=${searchQuery}&`;
            if (selectedCategories.length > 0) {
                url += `categories=${selectedCategories.join(',')}`;
            }
            
            const response = await api.get(url);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to load items');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategories]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleCategoryChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleSelectAllCategories = (event) => {
        if (event.target.checked) {
            setSelectedCategories(categories);
        } else {
            setSelectedCategories([]);
        }
    };

    const renderSelectedCategories = (selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected && selected.map((value) => (
                value && (
                    <Chip 
                        key={value} 
                        label={value.charAt(0).toUpperCase() + value.slice(1)}
                        size="small"
                    />
                )
            ))}
        </Box>
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.primary.main 
                    }}
                >
                    Available Items
                </Typography>

                <Paper 
                    elevation={2} 
                    sx={{ 
                        p: 3, 
                        mb: 4,
                        backgroundColor: theme.palette.background.paper 
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClearSearch} size="small">
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Categories</InputLabel>
                                <Select
                                    multiple
                                    value={selectedCategories}
                                    onChange={handleCategoryChange}
                                    renderValue={renderSelectedCategories}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedCategories.length === categories.length}
                                                    indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
                                                    onChange={handleSelectAllCategories}
                                                />
                                            }
                                            label="Select All"
                                            sx={{ width: '100%' }}
                                        />
                                    </MenuItem>
                                    <Divider />
                                    {categories.map((category) => (
                                        category && (
                                            <MenuItem key={category} value={category}>
                                                <Checkbox checked={selectedCategories.includes(category)} />
                                                <ListItemText 
                                                    primary={category.charAt(0).toUpperCase() + category.slice(1)}
                                                />
                                            </MenuItem>
                                        )
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">
                        {error}
                    </Typography>
                ) : items.length === 0 ? (
                    <Typography align="center" color="text.secondary">
                        No items found
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {items.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                                <ItemCard item={item} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default ItemList; 