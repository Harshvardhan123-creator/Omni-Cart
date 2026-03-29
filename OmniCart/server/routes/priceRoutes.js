
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    // Dummy competitor data
    const competitors = [
        { name: 'Amazon', price: 99.99, shipping: 0 },
        { name: 'Walmart', price: 95.50, shipping: 5.99 },
        { name: 'Target', price: 105.00, shipping: 0 },
        { name: 'BestBuy', price: 102.99, shipping: 0 }
    ];

    // Simulate network delay
    setTimeout(() => {
        res.json(competitors);
    }, 500);
});

export default router;
