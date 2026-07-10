import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="h5" color="error" gutterBottom>
                            Something went wrong
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => window.location.reload()}
                            sx={{ mt: 2 }}
                        >
                            Reload Page
                        </Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 