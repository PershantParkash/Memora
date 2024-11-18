import { User } from '../models/userModel.js';  
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config(); 

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation for email and password
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Encrypt the password using bcrypt
        const salt = await bcrypt.genSalt(10);  // Generate a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password with the salt

        // Create a new user with the hashed password
        const user = await User.create({ username, email, password: hashedPassword });

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        // Send the response with the token
        res.status(201).json({
            message: 'User registered successfully',
            user: { username: user.username, email: user.email },
            token, // Send the token to the client
        });
    } catch (error) {
        console.error('Error registering user:', error); 
        res.status(500).json({ message: 'Error registering user', error: error.message || error });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.userId; // Directly use the userId from middleware

        const users = await User.find({ _id: { $ne: currentUserId } }).select('username email');

        res.status(200).json({
            message: 'Users fetched successfully',
            users,
        });
    } catch (error) {
        console.error('Error fetching users:', error.message, error.stack);
        res.status(500).json({ message: 'Error fetching users', error: error.message || error });
    }
};
