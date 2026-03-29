console.log("Checking database link:", process.env.MONGODB_URI ? "LINK EXISTS" : "LINK IS MISSING");
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import priceRoutes from './routes/priceRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/omnicart';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Health check with DB status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    status: 'OK', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/compare-prices', priceRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server initialised on port ${PORT}`);
  console.log(`📡 Mode: ${process.env.NODE_ENV || 'development'}`);
  
  // Connect to Database asynchronously
  connectDB()
    .then(() => console.log('✅ Database connection established'))
    .catch((err) => {
      console.error('❌ CRITICAL: Database connection failed!');
      console.error(`Reason: ${err.message}`);
      console.log('💡 TIP: Check if your IP is whitelisted in MongoDB Atlas.');
    });
});

export default app;
