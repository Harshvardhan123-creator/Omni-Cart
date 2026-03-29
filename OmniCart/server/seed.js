import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const sampleProducts = [
    {
        name: "Wireless Bluetooth Headphones",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
        price: 199.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
        ],
        rating: 4.5,
        reviews: 128,
        stock: 45,
        brand: "AudioTech",
        tags: ["wireless", "bluetooth", "noise-cancelling"],
        specifications: {
            "Battery Life": "30 hours",
            "Connectivity": "Bluetooth 5.0",
            "Weight": "250g"
        }
    },
    {
        name: "Smart Watch Pro",
        description: "Advanced fitness tracking smartwatch with heart rate monitor",
        price: 299.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
        rating: 4.7,
        reviews: 256,
        stock: 30,
        brand: "FitTech",
        tags: ["smartwatch", "fitness", "health"],
        specifications: {
            "Display": "1.4 inch AMOLED",
            "Battery": "7 days",
            "Water Resistance": "5ATM"
        }
    },
    {
        name: "Laptop Backpack",
        description: "Durable water-resistant backpack with laptop compartment",
        price: 49.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
        rating: 4.3,
        reviews: 89,
        stock: 100,
        brand: "TravelGear",
        tags: ["backpack", "laptop", "travel"],
        specifications: {
            "Capacity": "25L",
            "Material": "Nylon",
            "Laptop Size": "Up to 15.6 inch"
        }
    },
    {
        name: "Running Shoes",
        description: "Lightweight breathable running shoes for maximum comfort",
        price: 89.99,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
        rating: 4.6,
        reviews: 342,
        stock: 75,
        brand: "SportFit",
        tags: ["shoes", "running", "sports"],
        specifications: {
            "Weight": "220g",
            "Material": "Mesh",
            "Sole": "Rubber"
        }
    },
    {
        name: "Stainless Steel Water Bottle",
        description: "Insulated water bottle keeps drinks cold for 24 hours",
        price: 24.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"],
        rating: 4.8,
        reviews: 512,
        stock: 200,
        brand: "HydroLife",
        tags: ["bottle", "insulated", "eco-friendly"],
        specifications: {
            "Capacity": "750ml",
            "Material": "Stainless Steel",
            "Insulation": "Double-wall vacuum"
        }
    }
];

const sampleUsers = [
    {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "+1234567890",
        address: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA"
        }
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        phone: "+1987654321",
        address: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "USA"
        }
    }
];

async function seedDatabase() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/omnicart';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Insert products
        const products = await Product.insertMany(sampleProducts);
        console.log(`Inserted ${products.length} products`);

        // Insert users with hashed passwords
        for (const userData of sampleUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
        }
        console.log(`Inserted ${sampleUsers.length} users`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
