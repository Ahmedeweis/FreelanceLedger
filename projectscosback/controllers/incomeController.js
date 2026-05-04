import pool from '../db.js';

export const createIncome = async (req, res) => {
    try {
        const { project_id, amount, date, description, is_received } = req.body;
        
        if (amount === undefined) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const query = `
            INSERT INTO income_entries (project_id, amount, date, description, is_received) 
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, COALESCE($5, true)) 
            RETURNING *
        `;
        const values = [project_id || null, amount, date || null, description || null, is_received !== undefined ? is_received : true];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating income:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, amount, date, description, is_received } = req.body;
        
        if (amount === undefined) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const query = `
            UPDATE income_entries 
            SET project_id = $1, amount = $2, date = COALESCE($3, date), description = $4, is_received = COALESCE($5, is_received), updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;
        const values = [project_id || null, amount, date || null, description || null, is_received !== undefined ? is_received : true, id];
        
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ error: "Income entry not found" });
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM income_entries WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Income entry not found" });
        res.json({ message: "Income entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting income:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

