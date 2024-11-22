import pool from '../database.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

//generate fake users note: all fake users passwors is 123456
const generate=async(numUsers) => {
    try {
        for (let i = 0; i < numUsers; i++) {
            const username = faker.internet.userName();
            const email = faker.internet.email();
            const rawPassword = "123456";
            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
            const values = [username, email, hashedPassword];

            const res = await pool.query(query, values);
            console.log('User generated:', res.rows[0]);
        }
    } catch (err) {
        console.error('Error generating fake users:', err);
    }
};

//generate 20 change number in function if you want more or less
generate(20);
