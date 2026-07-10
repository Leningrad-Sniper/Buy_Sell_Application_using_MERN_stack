import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#90caf9' : '#1976d2',
                light: darkMode ? '#e3f2fd' : '#42a5f5',
                dark: darkMode ? '#42a5f5' : '#1565c0',
            },
            secondary: {
                main: darkMode ? '#f48fb1' : '#dc004e',
            },
            background: {
                default: darkMode ? '#121212' : '#f5f5f5',
                paper: darkMode ? '#1e1e1e' : '#ffffff',
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000',
                secondary: darkMode ? '#b0b0b0' : '#666666',
            }
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    },
                    '*': {
                        transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                        borderBottom: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '8px',
                        textTransform: 'none',
                    },
                    contained: {
                        color: '#ffffff',
                    },
                    text: {
                        color: 'inherit',
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        color: 'inherit',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        },
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        color: 'inherit',
                    },
                },
            },
        },
    });

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}; 