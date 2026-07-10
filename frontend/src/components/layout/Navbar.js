import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Tooltip,
    useMediaQuery,
    useTheme as useMuiTheme,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ShoppingCart,
    Person,
    Logout,
    LightMode,
    DarkMode,
    Add,
    History,
    LocalShipping,
    Home
} from '@mui/icons-material';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const theme = useMuiTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = user ? [
        { text: 'Home', icon: <Home />, path: '/' },
        { text: 'Add Item', icon: <Add />, path: '/items/add' },
        { text: 'Cart', icon: <ShoppingCart />, path: '/cart' },
        { text: 'Orders', icon: <History />, path: '/orders' },
        { text: 'Deliver', icon: <LocalShipping />, path: '/deliver' }
    ] : [];

    const drawer = (
        <Box sx={{ width: 250 }}>
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text} 
                        component={RouterLink} 
                        to={item.path}
                        onClick={handleDrawerToggle}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar 
                position="sticky" 
                elevation={0} 
                sx={{ 
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderBottom: 1,
                    borderColor: theme.palette.divider
                }}
            >
                <Toolbar>
                    {isMobile && user && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            flexGrow: 0, 
                            textDecoration: 'none', 
                            color: 'inherit',
                            fontWeight: 'bold',
                            mr: 4
                        }}
                    >
                        IIITH Buy-Sell
                    </Typography>

                    {user && !isMobile && (
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    startIcon={item.icon}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: theme.palette.text.primary,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleProfileMenuOpen}
                                    size="small"
                                >
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                        {user.firstName[0]}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={toggleDarkMode}>
                                {darkMode ? <LightMode /> : <DarkMode />}
                            </IconButton>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                color="inherit" 
                                component={RouterLink} 
                                to="/login"
                            >
                                Login
                            </Button>
                            <Button 
                                variant="contained" 
                                component={RouterLink} 
                                to="/register"
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                    }
                }}
            >
                <MenuItem 
                    component={RouterLink} 
                    to="/profile"
                >
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar; 