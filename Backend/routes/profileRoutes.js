// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticateUser = require('../middleware/authMiddleware');

// Route to create a new profile (requires authentication)
router.post('/profile', authenticateUser, profileController.createProfile);

// Route to update an existing profile (requires authentication)
router.put('/profile/:userId', authenticateUser, profileController.updateProfile);

// Route to get a profile by userId (requires authentication)
router.get('/profile/:userId', authenticateUser, profileController.getProfile);

// Route to delete a profile by userId (requires authentication)
router.delete('/profile/:userId', authenticateUser, profileController.deleteProfile);

module.exports = router;
