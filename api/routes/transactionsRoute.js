import express from 'express';
import pool from '../../database.js';

const router = express.Router();

// Transaction endpoints --------------------------------------------

// Get all transactions
router.get('/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get transaction by id
router.get('/transactions/:id', async (req, res) => {
    const transactionId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create a new transaction
router.post('/transactions', async (req, res) => {
    const { user_id, items, checkout_date, total_price } = req.body;

    if (!user_id || !Array.isArray(items) || !checkout_date || !total_price) {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    try {
        // JSON conversion for items
        const jItems = JSON.stringify(items);

        const result = await pool.query(
            'INSERT INTO transactions (user_id, items, checkout_date, total_price) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, jItems, checkout_date, total_price]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update transaction by id
router.put('/transactions/:id', async (req, res) => {
    const transactionId = parseInt(req.params.id, 10);
    const { items, pickup_date, checkout_date, total_price } = req.body;

    if (!Array.isArray(items) || !pickup_date || !checkout_date || typeof total_price !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    try {
        // JSON conversion for items
        const jItems = JSON.stringify(items);

        const result = await pool.query(
            'UPDATE transactions SET items = $1, pickup_date = $2, checkout_date = $3, total_price = $4 WHERE id = $5 RETURNING *',
            [jItems, pickup_date, checkout_date, total_price, transactionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete transaction by id
router.delete('/transactions/:id', async (req, res) => {
    const transactionId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING id', [transactionId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get transactions by user ID
router.get('/transactions/user/:userId', async (req, res) => {
    const userId = req.params.userId;  // Get user ID from URL parameter

    const query = 'SELECT * FROM transactions WHERE user_id = $1';
    
    try {
        const result = await pool.query(query, [userId]);

        // Check if the result has any rows
        if (result.rows.length > 0) {
            return res.json({ transactions: result.rows });
        } else {
            return res.json({ transactions: [] });
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ message: 'Error fetching transactions', error });
    }
});

// Update pickup_date to the current time
router.put('/transactions/pickup/:id', async (req, res) => {
    const transactionId = parseInt(req.params.id, 10);
    const currentTime = new Date(); // Get the current time

    try {
        const result = await pool.query(
            'UPDATE transactions SET pickup_date = $1 WHERE id = $2 RETURNING *',
            [currentTime, transactionId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
