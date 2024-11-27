import express from 'express';
import pool from '../../database.js';

const router = express.Router();

//get all foods
router.get('/foods', async (req, res) => {
    const category = req.query.c;
    const name = req.query.n;
    const page = parseInt(req.query.page);  // Optional page
    const limit = parseInt(req.query.limit);  // Optional limit
    
    let query = 'SELECT id, user_id, name, category, area, imagelink, instructions, ingredients, measurements, price,creation_date FROM food';
    let params = [];

    // Build query conditions
    if (category && name) {
        query += ' WHERE category=$1 AND name ILIKE $2';
        params.push(category, `%${name}%`);
    } else if (category) {
        query += ' WHERE category=$1';
        params.push(category);
    } else if (name) {
        query += ' WHERE name ILIKE $1';
        params.push(`%${name}%`);
    }

    // Apply pagination if page and limit are provided
    if (page && limit) {
        const offset = (page - 1) * limit;  // Calculate the offset
        query += ' LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
    }

    try {
        const result = await pool.query(query, params);

        // Optional: Fetch total count of items for pagination info
        if (page && limit) {
            const countResult = await pool.query('SELECT COUNT(*) FROM food');
            const totalItems = parseInt(countResult.rows[0].count, 10);
            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                data: result.rows,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages
                }
            });
        } else {
            res.status(200).json(result.rows);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//find food by id
router.get('/foods/:id', async (req, res) => {
    const foodId = parseInt(req.params.id, 10);
    try {
        const result = await pool.query('SELECT id,name,category,area,imagelink,instructions,ingredients,measurements,price,creation_date FROM food WHERE id = $1', [foodId]);
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
router.post('/foods', async (req, res) => {
    const { name, imagelink, category, price,ingredients,measurements,area,instructions,user_id} = req.body;
    //current time
    const curr = new Date();

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price cannot be empty' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO food (name, imagelink, category, price,ingredients,measurements,area,instructions,user_id,creation_date) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10) RETURNING id, name, imagelink, category, price',
            [name, imagelink, category, price,ingredients,measurements,area,instructions,user_id,curr]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

//update food by id
router.put('/foods/:id', async (req, res) => {
    const foodId = parseInt(req.params.id, 10);
    const { name, imagelink, category, price, ingredients, measurements, area, instructions } = req.body;

    try {
        const result = await pool.query(
            `UPDATE food SET name = $1, imagelink = $2, category = $3, price = $4, ingredients = $5, measurements = $6, area = $7, instructions = $8 WHERE id = $9 RETURNING id, name, imagelink, category, price, ingredients, measurements, area, instructions`,
            [name, imagelink, category, price, ingredients, measurements, area, instructions, foodId]
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
router.delete('/foods/:id', async (req, res) => {
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


export default router;
