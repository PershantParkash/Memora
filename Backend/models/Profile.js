const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    profilePicture: {
      type: String, 
      default: 'https://www.w3schools.com/w3images/avatar2.png', 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, 
  }
);


const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
