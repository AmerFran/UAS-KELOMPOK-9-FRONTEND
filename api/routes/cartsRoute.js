import express from 'express';
import pool from '../../database.js';

const router = express.Router();

//cart endpoints--------------------------------------------
//get all carts
router.get('/carts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cart');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//get card by id
router.get('/carts/:id', async (req, res) => {
    const cartId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('SELECT * FROM cart WHERE id = $1', [cartId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/carts', async (req, res) => {
    const { user_id, items, total_price } = req.body;

    if (!user_id || !Array.isArray(items) || typeof total_price !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    try {
        //json convertion
        const jItems = JSON.stringify(items);

        const result = await pool.query(
            'INSERT INTO cart (user_id, items, total_price) VALUES ($1, $2, $3) RETURNING *',
            [user_id, jItems, total_price] 
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//update cart by id
router.put('/carts/:id', async (req, res) => {
    const cartId = parseInt(req.params.id, 10);
    const { items, total_price } = req.body;

    if (!Array.isArray(items) || typeof total_price !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    try {
        //json convertion
        const jItems = JSON.stringify(items);

        const result = await pool.query(
            'UPDATE cart SET items = $1, total_price = $2 WHERE id = $3 RETURNING *',
            [jItems, total_price, cartId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//delete cart by id
router.delete('/carts/:id', async (req, res) => {
    const cartId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('DELETE FROM cart WHERE id = $1 RETURNING id', [cartId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/carts/user/:userId', async (req, res) => {
    const userId = req.params.userId;  // Get user ID from URL parameter

    // Use parameterized queries to avoid SQL injection
    const query = 'SELECT * FROM cart WHERE user_id = $1';
    
    try {
        // Execute the query with the parameter
        const result = await pool.query(query, [userId]);

        // Check if the result has any rows
        if (result.rows.length > 0) {
            // Cart exists, return the cart details
            return res.json({ cart: result.rows[0] });
        } else {
            // No cart found for this user
            return res.json({ cart: null });
        }
    } catch (error) {
        // Log and handle the error
        console.error('Error fetching cart:', error);
        return res.status(500).json({ message: 'Error fetching cart', error });
    }
});
export default router;
