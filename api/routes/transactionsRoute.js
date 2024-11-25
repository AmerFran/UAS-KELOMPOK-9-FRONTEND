import express from 'express';
import pool from '../../database.js';

const router = express.Router();

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

// Get a transaction by ID
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
    const { cart_id, user_id, pickup_date, checkout_date, picked_up } = req.body;

    if (!cart_id || !user_id || !checkout_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO transactions (cart_id, user_id, pickup_date, checkout_date, picked_up) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [cart_id, user_id, pickup_date, checkout_date, picked_up || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update a transaction by ID
router.put('/transactions/:id', async (req, res) => {
    const transactionId = parseInt(req.params.id, 10);
    const { pickup_date, checkout_date, picked_up } = req.body;

    try {
        const result = await pool.query(
            'UPDATE transactions SET pickup_date = $1, checkout_date = $2, picked_up = $3 WHERE id = $4 RETURNING *',
            [pickup_date, checkout_date, picked_up, transactionId]
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

// Delete a transaction by ID
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

export default router;
