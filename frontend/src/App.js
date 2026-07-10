import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ItemList from './components/items/ItemList';
import AddItem from './components/items/AddItem';
import Cart from './components/cart/Cart';
import OrderHistory from './components/orders/OrderHistory';
import DeliverItems from './components/orders/DeliverItems';
import Profile from './components/profile/Profile';
import ItemDetail from './components/items/ItemDetail';
import { Container } from '@mui/material';
import CASCallback from './components/auth/CASCallback';
import { ThemeProvider } from './context/ThemeContext';
import { CssBaseline } from '@mui/material';
import UserProfile from './components/profile/UserProfile';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
    return (
        <ThemeProvider>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Navbar />
                    <Container sx={{ mt: 4 }}>
                        <ErrorBoundary>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/items" element={<ItemList />} />
                                <Route 
                                    path="/items/add" 
                                    element={
                                        <ProtectedRoute>
                                            <AddItem />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/cart" 
                                    element={
                                        <ProtectedRoute>
                                            <Cart />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/orders" 
                                    element={
                                        <ProtectedRoute>
                                            <OrderHistory />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/deliver" 
                                    element={
                                        <ProtectedRoute>
                                            <DeliverItems />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route 
                                    path="/profile" 
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route path="/items/:id" element={<ItemDetail />} />
                                <Route 
                                    path="/" 
                                    element={
                                        <ProtectedRoute>
                                            <ItemList />
                                        </ProtectedRoute>
                                    } 
                                />
                                <Route path="/cas/callback" element={<CASCallback />} />
                                <Route 
                                    path="/profile/:userId" 
                                    element={
                                        <ProtectedRoute>
                                            <UserProfile />
                                        </ProtectedRoute>
                                    } 
                                />
                            </Routes>
                        </ErrorBoundary>
                    </Container>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
