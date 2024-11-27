import express from 'express';
import pool from '../../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'your-secret-key'; //random key

//hashing
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

//user endpoints -----------------------------------------
//gets data from all users (except password)
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//find user by id
router.get('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//creates a new user
router.post('/users', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // hashing password
        const hashedPassword = await hashPassword(password);

        // inserts into database
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        //23505 is unique constraint violation
        if (error.code === '23505') {
            if (error.constraint.includes('username')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            if (error.constraint.includes('email')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }
        res.status(500).json({ error: 'Database error' });
    }
});

// Update user by id
router.put('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the current user credentials
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password is correct
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
        return res.status(400).json({ error: 'Password is incorrect' });
    }

    try {
        // Update the user in the database
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
            [username, email, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        //23505 is unique constraint violation
        if (error.code === '23505') {
            if (error.detail.includes('username')) {
                return res.status(400).json({ error: 'Username already exists' });
            } else if (error.detail.includes('email')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        // Handle other database errors
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/users/changepass/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { newpass, oldpass } = req.body;

    if (!newpass || !oldpass) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        //gets current user credentials
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        //checks if password is correct
        const isOldPasswordCorrect = await bcrypt.compare(oldpass, user.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        //hash new password
        const hashedPassword = await bcrypt.hash(newpass, 10);

        //update the user un database
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});


//delete user by id
router.delete('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      const result = await pool.query('SELECT id, username, email, password FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const user = result.rows[0];
  
      //comparing password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      //generate token
      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

export default router;
