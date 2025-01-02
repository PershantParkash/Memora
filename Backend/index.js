import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';  
import cors from 'cors';
import friendRoutes from './routes/friendRoutes.js';
import profileRoutes from './routes/profileRoutes.js'
// import fileUploadMiddleware from './middlewares/fileUploadMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadSingleFile, uploadMultipleFiles } from './middlewares/fileUploadMiddleware.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/auth', authRoutes); 
app.use('/api/profile', profileRoutes); 
app.use('/api/friends', friendRoutes);

// const uploadFolder = path.join('C:\\Users\\Pershant\\Desktop\\Memora\\backend', 'uploads');

// app.post('/upload', uploadSingleFile, (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }

//     res.status(200).json({
//         message: 'File uploaded successfully.',
//         file: req.file,
//     });
// });

// app.post('/upload-multiple', uploadMultipleFiles, (req, res) => {
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).send('No files uploaded.');
//     }

//     res.status(200).json({
//         message: 'Files uploaded successfully.',
//         files: req.files,
//     });
// });

// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder);
// }
const uploadsFolder = path.resolve('C:\\Users\\Pershant\\Desktop\\Memora\\backend', 'uploads');
app.use('/uploads', express.static(uploadsFolder));

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
