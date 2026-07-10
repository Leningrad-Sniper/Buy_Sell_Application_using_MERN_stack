const express = require('express');
const router = express.Router();
const cas = require('../config/cas');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const axios = require('axios');

// CAS Login route
router.get('/login', (req, res) => {
    // Redirect to CAS login page
    const serviceUrl = `${req.protocol}://${req.get('host')}/api/cas/callback`;
    const loginUrl = `https://login.iiit.ac.in/cas/login?service=${encodeURIComponent(serviceUrl)}`;
    res.redirect(loginUrl);
});

// CAS Callback route
router.get('/callback', async (req, res) => {
    try {
        const ticket = req.query.ticket;
        if (!ticket) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=No ticket provided`);
        }

        const serviceUrl = `${req.protocol}://${req.get('host')}/api/cas/callback`;
        const validateUrl = `https://login.iiit.ac.in/cas/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(serviceUrl)}`;

        const response = await axios.get(validateUrl);
        const responseText = response.data;

        // Parse CAS response (XML format)
        if (responseText.includes('authenticationSuccess')) {
            // Extract username from CAS response
            const usernameMatch = responseText.match(/<cas:user>(.*?)<\/cas:user>/);
            if (!usernameMatch) {
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=Invalid response`);
            }

            // Get the full email from CAS response
            const email = usernameMatch[1];
            
            // Find or create user
            let user = await User.findOne({ email });
            if (!user) {
                // Create new user with CAS email
                user = new User({
                    email,
                    firstName: 'IIIT',
                    lastName: 'User',
                    password: Math.random().toString(36), // Random password for CAS users
                    age: 18,
                    contactNumber: '0000000000'
                });
                await user.save();
            }

            // Generate JWT token
            const token = generateToken(user._id);

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL}/cas/callback?token=${token}`);

            // Inside the callback route
            console.log('CAS Response:', responseText);
            console.log('Extracted Email:', email);
            console.log('Generated Token:', token);
        } else {
            res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
        }
    } catch (error) {
        console.error('CAS Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }
});

module.exports = router; 