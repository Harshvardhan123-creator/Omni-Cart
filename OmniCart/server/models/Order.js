import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'COD', 'Stripe', 'credit_card', 'debit_card', 'paypal', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryDate: {
        type: Date
    },
    trackingHistory: [{
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        message: { type: String },
        completed: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
