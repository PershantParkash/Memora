import { Friendship } from '../models/friendshipModel.js';
import { User } from '../models/userModel.js';  // Assuming you have a User model

// Send a friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const { friendUserId } = req.body; 
        const userId = req.userId; 

        if (userId === friendUserId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
        }

        const existingFriendship = await Friendship.findOne({
            $or: [
                { user_id: userId, friend_user_id: friendUserId },
                { user_id: friendUserId, friend_user_id: userId }
            ]
        });

        if (existingFriendship) {
            return res.status(400).json({ message: 'Friendship already exists or pending.' });
        }

        const friendship = new Friendship({
            user_id: userId,
            friend_user_id: friendUserId,
            status: 'pending',
        });

        await friendship.save(); 

        res.status(201).json({ message: 'Friend request sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending friend request', error });
    }
};


// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { friendshipId } = req.body; // The friendship ID
        const userId = req.userId; // The authenticated user's ID

        // Find the friendship by ID and check if the user is either the requester or the recipient
        const friendship = await Friendship.findById(friendshipId);

        if (!friendship) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        // Ensure the user accepting the request is the friend_user_id (the one receiving the request)
        if (friendship.friend_user_id.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to accept this request.' });
        }

        // Update the status to 'accepted'
        friendship.status = 'accepted';
        await friendship.save();

        res.status(200).json({ message: 'Friend request accepted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error accepting friend request', error });
    }
};


export const getUserFriends = async (req, res) => {
    try {
        const userId = req.userId; // Get the authenticated user's ID

        // Find all accepted friendships where the current user is either the requester or the recipient
        const friendships = await Friendship.find({
            $or: [
                { user_id: userId, status: 'accepted' },
                { friend_user_id: userId, status: 'accepted' }
            ]
        }).populate('user_id friend_user_id'); // Populate user info

        // Map the results to get only relevant user details
        const friends = friendships.map(friendship => {
            return friendship.user_id._id.toString() === userId
                ? friendship.friend_user_id
                : friendship.user_id;
        });

        res.status(200).json({ friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving friends', error });
    }
};


export const declineFriendRequest = async (req, res) => {
    try {
        const { friendshipId } = req.body; // The friendship ID
        const userId = req.userId; // The authenticated user's ID

        // Find the friendship by ID
        const friendship = await Friendship.findById(friendshipId);

        if (!friendship) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        // Ensure the user declining the request is the one receiving the request
        if (friendship.friend_user_id.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to decline this request.' });
        }

        // Reject the request by updating the status
        friendship.status = 'rejected';
        await friendship.save();

        res.status(200).json({ message: 'Friend request declined.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error declining friend request', error });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const { friendUserId } = req.body;
        const userId = req.userId; // The authenticated user's ID

        // Delete the friendship (both directions: user -> friend and friend -> user)
        await Friendship.deleteMany({
            $or: [
                { user_id: userId, friend_user_id: friendUserId },
                { user_id: friendUserId, friend_user_id: userId }
            ]
        });

        res.status(200).json({ message: 'Friend removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing friend', error });
    }
};
