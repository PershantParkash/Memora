// controllers/profileController.js
const Profile = require('../models/Profile');

export const createProfile = async (req, res) => {
  const { bio, profilePicture, phoneNumber } = req.body;
  const userId = req.userId; // User ID from middleware
  
  try {
    // Check if profile already exists
    let existingProfile = await Profile.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const profile = new Profile({
      userId,
      bio,
      profilePicture,
      phoneNumber,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateProfile = async (req, res) => {
  const { bio, profilePicture, phoneNumber } = req.body;
  const userId = req.userId; // User ID from middleware

  try {
    // Find the profile by userId
    let profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update the fields if provided
    profile.bio = bio || profile.bio;
    profile.profilePicture = profilePicture || profile.profilePicture;
    profile.phoneNumber = phoneNumber || profile.phoneNumber;

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
