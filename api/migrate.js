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
            name VARCHAR(100) NOT NULL,
            imagelink TEXT,
            category VARCHAR(50),
            price DECIMAL(10, 2) NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            items INT[],
            total_price DECIMAL(10, 2)
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
