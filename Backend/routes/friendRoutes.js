import express from 'express';
import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  getUserFriends, 
  declineFriendRequest, 
  removeFriend 
} from '../controllers/friendController.js'; // Import controller functions
import authMiddleware from '../middlewares/authMiddleware.js'; // Protect routes with auth

const router = express.Router();

router.post('/send', authMiddleware, sendFriendRequest);

router.post('/accept', authMiddleware, acceptFriendRequest);

router.get('/user-friends', authMiddleware, getUserFriends);

router.post('/decline', authMiddleware, declineFriendRequest);

router.delete('/remove', authMiddleware, removeFriend);

export default router;
