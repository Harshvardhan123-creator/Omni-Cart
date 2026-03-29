import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import upload from '../utils/upload.js';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicUrl: user.profilePicUrl,
                addresses: user.addresses,
                paymentMethods: user.paymentMethods,
                orders: user.orders,
                wishlist: user.wishlist
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email })
            .populate('orders')
            .populate('wishlist');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicUrl: user.profilePicUrl,
                addresses: user.addresses,
                paymentMethods: user.paymentMethods,
                orders: user.orders,
                wishlist: user.wishlist
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User with that email does not exist' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire time (10 minutes)
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Create reset url - use FRONTEND_URL from env, fallback to localhost
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/#/reset-password/${resetToken}`;

        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                <h2 style="color: #1e293b; margin-bottom: 16px;">Password Reset Request</h2>
                <p style="color: #475569;">You requested to reset your OmniCart password. Click the button below to reset it. This link is valid for <strong>10 minutes</strong>.</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; margin: 24px 0; padding: 12px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                   Reset My Password
                </a>
                <p style="color: #94a3b8; font-size: 14px;">Or copy this link: <br/><a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a></p>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">If you did not request this, please ignore this email. Your password will not change.</p>
            </div>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: message
            });

            res.status(200).json({ success: true, message: 'Email sent' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ error: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        // Hash the token from URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Find user with this token and check if it's expired
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired password reset token' });
        }

        // Set new password
        user.password = await bcrypt.hash(req.body.password, 10);
        
        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('orders')
            .populate('wishlist');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile picture
router.put('/update-profile-pic', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Upload to Cloudinary using upload_stream
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'omnicart_profiles' },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                // Pipe the buffer to Cloudinary
                stream.write(req.file.buffer);
                stream.end();
            });
        };

        const result = await streamUpload(req);

        // Update the user's profile database record
        user.profilePicUrl = result.secure_url;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            profilePicUrl: user.profilePicUrl
        });
    } catch (error) {
        console.error('Update Profile Pic Error:', error);
        res.status(500).json({ error: error.message || 'Error updating profile picture' });
    }
});

// Update user profile
router.put('/:id', async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // If password is being updated, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add to wishlist
router.post('/:id/wishlist/:productId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.wishlist.includes(req.params.productId)) {
            user.wishlist.push(req.params.productId);
            await user.save();
        }

        res.json(user.wishlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remove from wishlist
router.delete('/:id/wishlist/:productId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(
            item => item.toString() !== req.params.productId
        );
        await user.save();

        res.json(user.wishlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update address
router.put('/address/:addressId', protect, async (req, res) => {
    try {
        const { street, city, state, zip, country, phone, type } = req.body;

        // Validation
        if (!street || !city || !state || !zip || !country || !phone) {
            return res.status(400).json({ message: 'Please fill in all address fields' });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.user._id, "addresses._id": req.params.addressId },
            {
                $set: {
                    "addresses.$.street": street,
                    "addresses.$.city": city,
                    "addresses.$.state": state,
                    "addresses.$.zip": zip,
                    "addresses.$.country": country,
                    "addresses.$.phone": phone,
                    "addresses.$.type": type || 'Home'
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json(user.addresses);
    } catch (error) {
        console.error("Update Address Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

// Add address
router.post('/address', protect, async (req, res) => {
    try {
        const { street, city, state, zip, country, phone, type } = req.body;

        // Validation - ensure all fields are present
        if (!street || !city || !state || !zip || !country || !phone) {
            return res.status(400).json({ message: 'Please fill in all address fields' });
        }

        // Check if this is the first address (to make it default)
        const userCheck = await User.findById(req.user._id);
        const isDefault = userCheck.addresses.length === 0;

        const newAddress = {
            street,
            city,
            state,
            zip,
            country,
            phone,
            type: type || 'Home',
            isDefault
        };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { addresses: newAddress } },
            { new: true } // Return updated document
        );

        res.json(user.addresses);
    } catch (error) {
        console.error("Add Address Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
});

// Delete address
router.delete('/address/:addressId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const luhnCheck = (val) => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        calc = Number(val.charAt(i)) * j;
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }
        checksum = checksum + calc;
        if (j === 1) { j = 2; } else { j = 1; }
    }
    return (checksum % 10) === 0;
};

// Add payment method
router.post('/card', protect, async (req, res) => {
    try {
        const { number, cardHolder, expiry, brand } = req.body;

        if (!number || !luhnCheck(number.replace(/\D/g, ''))) {
            return res.status(400).json({ message: 'Invalid Card Number' });
        }

        const user = await User.findById(req.user._id);

        const newCard = {
            cardHolder,
            last4Digits: number.slice(-4),
            expiry,
            brand: brand || 'CARD'
        };

        user.paymentMethods.push(newCard);
        await user.save();
        res.json(user.paymentMethods);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete payment method
router.delete('/card/:cardId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.paymentMethods = user.paymentMethods.filter(card => card._id.toString() !== req.params.cardId);
        await user.save();
        res.json(user.paymentMethods);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
