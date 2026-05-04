import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const sql = `
DROP VIEW IF EXISTS project_balances;
CREATE VIEW project_balances AS
SELECT 
    p.id AS project_id,
    p.name AS project_name,
    p.total_price,
    p.status,
    p.start_date,
    COALESCE(SUM(ie.amount) FILTER (WHERE ie.is_received = true), 0) AS total_paid,
    p.total_price - COALESCE(SUM(ie.amount) FILTER (WHERE ie.is_received = true), 0) AS remaining_balance
FROM 
    projects p
LEFT JOIN 
    income_entries ie ON p.id = ie.project_id
GROUP BY 
    p.id, p.name, p.total_price, p.status, p.start_date;
`;

pool.query(sql)
    .then(() => {
        console.log('View dropped and recreated successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error updating view:', err);
        process.exit(1);
    });
