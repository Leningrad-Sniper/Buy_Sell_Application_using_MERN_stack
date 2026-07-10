const CAS = require('cas-authentication');

const cas = new CAS({
    cas_url: 'https://login.iiit.ac.in/cas/',
    service_url: process.env.FRONTEND_URL || 'http://localhost:5000',
    cas_version: '3.0',
    renew: false,
    is_dev_mode: false,
    dev_mode_user: '',
    session_name: 'cas_user',
    session_info: false,
    destroy_session: false
});

module.exports = cas; 