import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupDatabase = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema setup...');
        await pool.query(schemaSql);
        console.log('Database schema created successfully.');

        // Insert some mock data if empty
        const projectCheck = await pool.query('SELECT count(*) FROM projects');
        if (parseInt(projectCheck.rows[0].count) === 0) {
            console.log('Inserting mock data...');
            const insertProject1 = `INSERT INTO projects (name, total_price, start_date, status, notes) VALUES ('Website Redesign', 5000.00, '2023-01-10', 'completed', 'Mock project') RETURNING id`;
            const res1 = await pool.query(insertProject1);
            const p1Id = res1.rows[0].id;

            const insertProject2 = `INSERT INTO projects (name, total_price, start_date, status, notes) VALUES ('Mobile App', 10000.00, '2024-03-15', 'pending', 'In progress') RETURNING id`;
            const res2 = await pool.query(insertProject2);
            const p2Id = res2.rows[0].id;
            
            const insertProject3 = `INSERT INTO projects (name, total_price, start_date, status, notes) VALUES ('SEO Optimization', 2000.00, '2025-01-05', 'at_risk', 'Client ghosted') RETURNING id`;
            const res3 = await pool.query(insertProject3);
            const p3Id = res3.rows[0].id;

            await pool.query(`INSERT INTO income_entries (project_id, amount, date, description, is_received) VALUES ($1, 2000.00, '2023-01-15', 'Down payment', true)`, [p1Id]);
            await pool.query(`INSERT INTO income_entries (project_id, amount, date, description, is_received) VALUES ($1, 3000.00, '2023-02-20', 'Final payment', true)`, [p1Id]);
            
            await pool.query(`INSERT INTO income_entries (project_id, amount, date, description, is_received) VALUES ($1, 2500.00, '2024-03-20', 'Milestone 1', true)`, [p2Id]);
            
            await pool.query(`INSERT INTO income_entries (project_id, amount, date, description, is_received) VALUES ($1, 500.00, '2025-01-10', 'Initial deposit', true)`, [p3Id]);

            // Standalone incomes
            await pool.query(`INSERT INTO income_entries (amount, date, description, is_received) VALUES (1500.00, '2023-05-10', 'Real Estate Bot', true)`);
            await pool.query(`INSERT INTO income_entries (amount, date, description, is_received) VALUES (800.00, '2024-06-15', 'Consultation fee (Awaiting)', false)`);
            await pool.query(`INSERT INTO income_entries (amount, date, description, is_received) VALUES (1200.00, '2025-04-01', 'Bug fixing for old client', true)`);
            
            console.log('Mock data inserted successfully.');
        } else {
            console.log('Database already contains data, skipping mock data insertion.');
        }

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        pool.end();
    }
};

setupDatabase();
