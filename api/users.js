const express=require('express');
const {Pool}=require('pg');
const bcrypt=require('bcryptjs');
const bodyParser=require('body-parser');

//database connection
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    database: 'foodBase',  
    password: '123456',
    port: 5432,
});

const app = express();
const port = 3000;
app.use(bodyParser.json());

//hashing
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

//gets all users and shows all rows except password
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//find user by id
app.get('/users/:id', async (req, res) => {
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
app.post('/users', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        //hashing password
        const hashedPassword = await hashPassword(password);

        //inserts into database
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { //23505 is the code for unique constraint violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Database error' });
    }
});

//update user by id
app.put('/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Hash the new password
        const hashedPassword = await hashPassword(password);

        // Update the user in the database
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, username, email',
            [username, email, hashedPassword, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//delete user by id
app.delete('/users/:id', async (req, res) => {
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

//starts the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
