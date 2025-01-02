import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadFolder = path.resolve('C:\\Users\\Pershant\\Desktop\\Memora\\backend', 'uploads');

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ storage });

export const uploadSingleFile = upload.single('file');

export const uploadMultipleFiles = upload.array('files', 10); 
