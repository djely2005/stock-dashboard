// src/lib/db.ts
import Pool from 'pg-pool'

// Ensure you have your database connection details in environment variables
export const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || '5431'),
});
