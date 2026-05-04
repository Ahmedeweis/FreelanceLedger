import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Senior Developer Approach: Database Initialization Script
 * This script automates the creation of tables and types in PostgreSQL.
 */
const initDb = async () => {
    const client = await pool.connect();
    try {
        console.log('--- Database Initialization Started ---');
        
        // Read the schema.sql file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute the SQL commands
        await client.query(schemaSql);
        
        console.log('✅ Database schema initialized successfully.');
        console.log('--- Database Initialization Completed ---');
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        // We don't exit the process here to allow the server to handle the failure if needed
        throw error; 
    } finally {
        client.release();
    }
};

export default initDb;
