import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    brand: {
        type: String
    },
    tags: [{
        type: String
    }],
    subCategory: {
        type: String,
        required: false
    },
    specifications: {
        type: Map,
        of: String
    },
    options: [{
        name: { type: String },
        values: [{
            value: { type: String },
            priceModifier: { type: Number, default: 0 }
        }]
    }],
    competitorData: {
        amazon: { price: Number, url: String },
        flipkart: { price: Number, url: String },
        myntra: { price: Number, url: String },
        croma: { price: Number, url: String }
    }
}, {
    timestamps: true
});

// Create a text index across all searchable fields for robust discovery
productSchema.index({ name: 'text', description: 'text', category: 'text', subCategory: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
