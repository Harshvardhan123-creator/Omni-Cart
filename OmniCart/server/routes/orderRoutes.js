import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            trackingHistory: [
                {
                    status: 'Order Placed',
                    message: 'Your order has been successfully placed.',
                    date: new Date(),
                    completed: true
                },
                {
                    status: 'Processing',
                    message: 'We are preparing your items.',
                    completed: false
                },
                {
                    status: 'Shipped',
                    message: 'Your package is on its way.',
                    completed: false
                },
                {
                    status: 'Delivered',
                    message: 'Package handed over to recipient.',
                    completed: false
                }
            ]
        };
        const order = new Order(orderData);
        await order.save();

        // Add order to user's orders
        if (req.body.user) {
            await User.findByIdAndUpdate(
                req.body.user,
                { $push: { orders: order._id } }
            );
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product')
            .populate('user', '-password');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const updateData = {};

        if (orderStatus) updateData.orderStatus = orderStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Cancel order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.orderStatus === 'delivered') {
            return res.status(400).json({ error: 'Cannot cancel delivered order' });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
