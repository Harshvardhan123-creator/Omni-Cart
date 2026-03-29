import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with optional filtering
router.get('/', async (req, res) => {
    try {
        const { category, subCategory, search, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (subCategory) {
            query.subCategory = subCategory;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        let sortOption = {};
        if (sort === 'price-asc') sortOption.price = 1;
        else if (sort === 'price-desc') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else sortOption.createdAt = -1;

        let products;

        if (search) {
            // Strategy 1: Try MongoDB $text search first (uses the text index)
            try {
                const textQuery = { ...query, $text: { $search: search } };
                products = await Product.find(textQuery).sort(sortOption);
            } catch (e) {
                products = [];
            }

            // Strategy 2: If $text returned nothing, fall back to flexible regex search
            // This catches partial matches like "MacBook" matching "MacBook Air M2"
            if (!products || products.length === 0) {
                const regex = new RegExp(search, 'i');
                const regexQuery = {
                    ...query,
                    $or: [
                        { name: regex },
                        { description: regex },
                        { category: regex },
                        { subCategory: regex },
                        { brand: regex },
                        { tags: regex }
                    ]
                };
                products = await Product.find(regexQuery).sort(sortOption);
            }
        } else {
            products = await Product.find(query).sort(sortOption);
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new product
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
