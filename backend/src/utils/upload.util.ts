import multer from 'multer';
import fs from 'fs';

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './src/uploads';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage: storage });
export const singleUpload = upload.single('image');
export const multipleUpload = upload.array('image', 10);
export const multipleUploadFile = upload.array('attach', 5);



