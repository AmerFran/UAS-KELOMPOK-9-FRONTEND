import express from 'express';
import pool from '../database.js';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';



const app = express();
const port = 3000;
const SECRET_KEY = 'your-secret-key'; //random key

app.use(bodyParser.json());
app.use(express.json())
app.use(cors());

//hashing
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

//user endpoints -----------------------------------------
//gets data from all users (except password)
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
    const { username, email,password} = req.body;

    if (!username || !email||!password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    //gets current user credentials
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    //checks if password is correct
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
        return res.status(400).json({ error: 'password is incorrect' });
    }

    try {
        //update the user in database
        const result = await pool.query(
            'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
            [username, email,userId]
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

app.put('/users/changepass/:id', async (req, res) => {
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

//login
app.post('/login', async (req, res) => {
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
//-----------------------------------------------------------




//food endpoints--------------------------------------------
//get all foods
app.get('/foods', async (req, res) => {
    const category=req.query.c;
    const name=req.query.n;
    let query='SELECT id, name, category, area, imagelink, instructions, ingredients, measurements, price FROM food';
    let params=[];

    //queries
    if (category && name) {
        query+=' WHERE category=$1 AND name ILIKE $2';
        params.push(category, `%${name}%`);
    } else if (category) {
        query+=' WHERE category = $1';
        params.push(category);
    } else if (name) {
        query+=' WHERE name ILIKE $1';
        params.push(`%${name}%`);
    }

    try {
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//find food by id
app.get('/foods/:id', async (req, res) => {
    const foodId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('SELECT id,name,category,area,imagelink,instructions,ingredients,measurements,price FROM food WHERE id = $1', [foodId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Food not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//create new food
app.post('/foods', async (req, res) => {
    const { name, imagelink, category, price,ingredients,measurements,area,instructions} = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price cannot be empty' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO food (name, imagelink, category, price,ingredients,measurements,area,instructions) VALUES ($1, $2, $3, $4,$5,$6,$7,$8) RETURNING id, name, imagelink, category, price',
            [name, imagelink, category, price,ingredients,measurements,area,instructions]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//update food by id
app.put('/foods/:id', async (req, res) => {
    const foodId = parseInt(req.params.id, 10);
    const { name, imagelink, category, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await pool.query(
            'UPDATE food SET name = $1, imagelink = $2, category = $3, price = $4 WHERE id = $5 RETURNING id, name, imagelink, category, price',
            [name, imagelink, category, price, foodId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Food not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//delete food by id
app.delete('/foods/:id', async (req, res) => {
    const foodId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('DELETE FROM food WHERE id = $1 RETURNING id', [foodId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Food not found' });
        }
        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//cart endpoints--------------------------------------------
//get all carts
app.get('/carts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cart');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//get card by id
app.get('/carts/:id', async (req, res) => {
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

//create new cart
app.post('/carts', async (req, res) => {
    const { user_id, items, total_price } = req.body;

    if (!user_id || !Array.isArray(items) || typeof total_price !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO cart (user_id, items, total_price) VALUES ($1, $2, $3) RETURNING *',
            [user_id, items, total_price]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//update cart by id
app.put('/carts/:id', async (req, res) => {
    const cartId = parseInt(req.params.id, 10);
    const { items, total_price } = req.body;

    if (!Array.isArray(items) || typeof total_price !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    try {
        const result = await pool.query(
            'UPDATE cart SET items = $1, total_price = $2 WHERE id = $3 RETURNING *',
            [items, total_price, cartId]
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
app.delete('/carts/:id', async (req, res) => {
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
//-----------------------------------------------------------

//starts the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
