import pool from './db.js';

const wipeData = async () => {
    try {
        console.log('Deleting all mock data...');
        await pool.query('TRUNCATE TABLE income_entries, projects CASCADE;');
        console.log('All data deleted successfully. The database is now empty.');
    } catch (err) {
        console.error('Error wiping data:', err);
    } finally {
        pool.end();
    }
};

wipeData();
