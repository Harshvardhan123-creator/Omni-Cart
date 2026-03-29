
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Fix for __dirname in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/omnicart';
        await mongoose.connect(mongoURI);
        console.log(`Connected to Host: ${mongoose.connection.host}`);
        console.log(`Connected to Port: ${mongoose.connection.port}`);
        console.log(`Connected to Database: ${mongoose.connection.name}`);
        console.log(`Connection String Used: ${mongoURI}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

connectDB();
