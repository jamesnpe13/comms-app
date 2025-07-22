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
const messagingController = require('../controllers/messagingController');

// Authentication routes
router.post('/auth/login', verifyPassword, authController.userLogin);
router.post('/auth/logout/', authenticateToken, authController.userLogout);
router.post('/auth/refresh', authController.refreshSessionTokens);

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

// Group routes
router.post(
  '/messaging/groups',
  authenticateToken,
  messagingController.createGroup
);
router.get(
  '/messaging/usergroups',
  authenticateToken,
  messagingController.getUserGroups
);
router.put(
  '/messaging/groups',
  authenticateToken,
  messagingController.createGroup
);

// Group members routes
router.post(
  '/messaging/groups/members',
  authenticateToken,
  messagingController.createMember
);
router.get(
  '/messaging/groups/members',
  authenticateToken,
  messagingController.getMembers
);
router.delete(
  '/messaging/groups/members',
  authenticateToken,
  messagingController.deleteMember
);

// Convo routes
router.post(
  '/messaging/convos',
  authenticateToken,
  messagingController.createConvo
);
router.get(
  '/messaging/convos',
  authenticateToken,
  messagingController.getAllConvos
);
router.get(
  '/messaging/convos/created',
  authenticateToken,
  messagingController.getConvosCreated
);
router.put(
  '/messaging/convos',
  authenticateToken,
  messagingController.updateConvo
);
router.delete(
  '/messaging/convos',
  authenticateToken,
  messagingController.deleteConvo
);

// Convo participants routes
router.post(
  '/messaging/participants',
  authenticateToken,
  messagingController.createParticipant
);
router.get(
  '/messaging/participants',
  authenticateToken,
  messagingController.getParticipants
);
router.delete(
  '/messaging/participants',
  authenticateToken,
  messagingController.deleteParticipant
);

// messages routes
router.post(
  '/messaging/messages',
  authenticateToken,
  messagingController.createMessage
);
router.get(
  '/messaging/messages',
  authenticateToken,
  messagingController.getMessages
);
router.put(
  '/messaging/messages',
  authenticateToken,
  messagingController.updateMessages
);
router.delete(
  '/messaging/messages',
  authenticateToken,
  messagingController.deleteMessages
);

module.exports = router;
