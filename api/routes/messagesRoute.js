import express from 'express';
import pool from '../../database.js';

const router = express.Router();

// Get all messages
router.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get a message by user ID
router.get('/messages/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const result = await pool.query('SELECT * FROM messages WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found for the user' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create or update a message for a user
router.post('/messages', async (req, res) => {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO messages (user_id, message) VALUES ($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET message = EXCLUDED.message
             RETURNING *`,
            [user_id, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete a message by user ID
router.delete('/messages/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const result = await pool.query('DELETE FROM messages WHERE user_id = $1 RETURNING id', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found for the user' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update a message by user ID
router.put('/messages/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Check if the message exists for the user
        const result = await pool.query('SELECT * FROM messages WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found for the user' });
        }

        // If message exists, update it
        const updatedResult = await pool.query(
            'UPDATE messages SET message = $1 WHERE user_id = $2 RETURNING *',
            [message, userId]
        );

        res.status(200).json(updatedResult.rows[0]); // Return updated message
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});


export default router;
