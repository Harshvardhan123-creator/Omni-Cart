import multer from 'multer';

// Use memory storage to store the file as a Buffer in RAM
// This allows us to pipe the stream directly to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png, webp).'));
        }
        cb(null, true);
    }
});

export default upload;
