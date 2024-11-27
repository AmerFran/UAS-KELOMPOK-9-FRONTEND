import pool from '../database.js';

//creates all the tables
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS food (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(50),
            area VARCHAR(50),
            imagelink TEXT,
            instructions TEXT,
            ingredients TEXT[],
            measurements TEXT[],
            price DECIMAL(10, 2) NOT NULL,
            creation_date TIMESTAMPTZ
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                items JSONB,
                total_price DECIMAL(10, 2)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                items JSONB,
                pickup_date TIMESTAMPTZ,
                checkout_date TIMESTAMPTZ,
                total_price DECIMAL(10, 2),
                picked_up BOOLEAN DEFAULT FALSE
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                message TEXT
            );
        `);


        console.log('Finished migrating tables');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await pool.end();
        console.log('Connection closed');
    }
};

// Call the function to create tables
createTables();
