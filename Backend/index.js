import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';  
import cors from 'cors';
import friendRoutes from './routes/friendRoutes.js';
dotenv.config();

const app = express();
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes); 
app.use('/api/friends', friendRoutes);

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.MONGO_URI;

mongoose.connect(DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.log('DB connection error:', err));
