// Express
const express = require('express');
const router = express.Router();

// Middleware
const { authenticateToken } = require('../middleware/authenticateToken');
const { hashPassword } = require('../middleware/hashPassword');
const { verifyPassword } = require('../middleware/verifyPassword');
const { authorizeUser } = require('../middleware/authorizeUser');
const { checkRole } = require('../middleware/routeProtection');

// Route controller
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

// User routes
router.get('/users/id/:id', authenticateToken, usersController.getUserById);
router.get('/users/search', authenticateToken, usersController.searchUsers);
router.post('/users/', hashPassword, usersController.registerUser);
router.get('/users/', authenticateToken, usersController.getAllUsers);
router.get('/users/me', authenticateToken, usersController.getCurrentUser);
router.get(
  '/users/username/:username',
  authenticateToken,
  usersController.getUserByUsername
);
router.put(
  '/users/update/:id',
  authenticateToken,
  authorizeUser,
  usersController.updateUser
);
router.delete(
  '/users/delete/:id',
  authenticateToken,
  authorizeUser,
  usersController.deleteUserById
);

// Authentication routes
router.post('/auth/login', verifyPassword, authController.userLogin);
router.post('/auth/logout/', authenticateToken, authController.userLogout);
router.post('/auth/refresh', authController.refreshSessionTokens);

module.exports = router;
