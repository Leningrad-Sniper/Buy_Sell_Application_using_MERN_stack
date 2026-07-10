import React from 'react';
import { Alert, Box } from '@mui/material';

const ErrorMessage = ({ message }) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Alert severity="error">
                {message || 'An error occurred. Please try again.'}
            </Alert>
        </Box>
    );
};

export default ErrorMessage; 