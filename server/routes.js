const express = require('express');
const router = express.Router();

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const chatController = require('./controllers/chatController');
const communityController = require('./controllers/communityController');

// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);

// Users
router.get('/students', userController.getAllStudents);
router.put('/students/:studentId', userController.updateStudent);
router.post('/students/:studentId/sales', userController.submitSale);

// Chat
router.get('/messages', chatController.getMessages);
router.post('/messages', chatController.sendMessage);

// Community
router.get('/posts', communityController.getPosts);
router.post('/posts', communityController.createPost);
router.post('/posts/:postId/like', communityController.likePost);
router.post('/posts/:postId/comment', communityController.addComment);

module.exports = router;