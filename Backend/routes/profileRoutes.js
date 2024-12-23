import express from 'express';
import { createProfile, updateProfile, getProfile, deleteProfile, getAllProfilesExceptCurrentUser, getProfileByID } from '../controllers/profileController.js';
const router = express.Router();
import authMiddleware from '../middlewares/authMiddleware.js';

router.post('/createProfile', authMiddleware, createProfile);

router.put('/updateProfile', authMiddleware, updateProfile);
router.get('/getProfile', authMiddleware, getProfile);
router.delete('/deleteProfile', authMiddleware, deleteProfile);
router.get('/getAllProfiles', authMiddleware, getAllProfilesExceptCurrentUser);
router.get('/getProfileByID/:UserID', authMiddleware, getProfileByID);

export default router;
