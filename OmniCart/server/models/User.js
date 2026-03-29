import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    profilePicUrl: {
        type: String,
        default: ''
    },
    phone: {
        type: String
    },
    addresses: [{
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String,
        type: {
            type: String,
            enum: ['Home', 'Work', 'Other'],
            default: 'Home'
        },
        isDefault: { type: Boolean, default: false }
    }],
    paymentMethods: [{
        cardHolder: String,
        last4Digits: String,
        expiry: String,
        brand: String
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
