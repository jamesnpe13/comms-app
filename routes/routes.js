// Express
const express = require('express');
const router = express.Router();

// Middleware
const { authenticateToken } = require('../middleware/authenticateToken');
const { hashPassword } = require('../middleware/hashPassword');
const { verifyPassword } = require('../middleware/verifyPassword');
const { checkRole } = require('../middleware/routeProtection');

// Route controller
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

// User routes
router.post('/users/', hashPassword, usersController.registerUser);
router.get('/users/', authenticateToken, usersController.getAllUsers);
router.get('/users/:id', authenticateToken, usersController.getUserById);
router.put('/users/:id', usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);

// Authentication routes
router.post('/auth/login', verifyPassword, authController.userLogin);
router.post('/auth/refresh', authController.refreshSessionTokens);

module.exports = router;
