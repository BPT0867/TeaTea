const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Định nghĩa đường dẫn
// POST: http://localhost:3000/api/auth/register
router.post('/register', authController.register);

// POST: http://localhost:3000/api/auth/login
router.post('/login', authController.login);

module.exports = router;