import pool from '../database.js';

//drops all tables
const dropTables=async()=>{
    try{
        await pool.query('DROP TABLE IF EXISTS cart;');
        await pool.query('DROP TABLE IF EXISTS users;');
        await pool.query('DROP TABLE IF EXISTS food;');
        await pool.query('DROP TABLE IF EXISTS transactions;');
        await pool.query('DROP TABLE IF EXISTS messages;');
        
        console.log('Finished deleting tables');
    }catch(error){
        console.error('Error during table deletion:',error);
    }finally{
        await pool.end();
        console.log('Connection closed');
    }
};

dropTables();
