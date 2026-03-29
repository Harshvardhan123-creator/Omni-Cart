import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'PLEASE_ADD_YOUR_CLOUD_NAME', 
    api_key: process.env.CLOUDINARY_API_KEY || 'PLEASE_ADD_YOUR_API_KEY', 
    api_secret: process.env.CLOUDINARY_API_SECRET || 'PLEASE_ADD_YOUR_API_SECRET'
});

export default cloudinary;
