import serverless from 'serverless-http';
import mongoose from 'mongoose';
import app from './server.js';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/omnicart';
        await mongoose.connect(mongoURI);
        isConnected = true;
        console.log('MongoDB connected for serverless function');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    return serverless(app)(event, context);
};
