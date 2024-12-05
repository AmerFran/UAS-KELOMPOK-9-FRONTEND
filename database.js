import pg from 'pg';
const {Pool}=pg

//database login
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'foodbase',
  password: '123456',
  port: 5432,
});
export default pool;
