import pool from '../db.js';

export const getProjects = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT project_id as id, project_name as name, total_price, status, total_paid, remaining_balance, start_date
            FROM project_balances
            ORDER BY project_name ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createProject = async (req, res) => {
    try {
        const { name, total_price, start_date, status, notes } = req.body;
        
        if (!name || total_price === undefined) {
            return res.status(400).json({ error: "Name and total_price are required" });
        }

        const query = `
            INSERT INTO projects (name, total_price, start_date, status, notes) 
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE), COALESCE($4, 'new')::project_status, $5) 
            RETURNING *
        `;
        const values = [name, total_price, start_date || null, status || 'new', notes || null];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, total_price, start_date, status, notes } = req.body;
        
        if (!name || total_price === undefined) {
            return res.status(400).json({ error: "Name and total_price are required" });
        }

        const query = `
            UPDATE projects 
            SET name = $1, total_price = $2, start_date = COALESCE($3, start_date), status = COALESCE($4, status)::project_status, notes = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;
        const values = [name, total_price, start_date || null, status || null, notes || null, id];
        
        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ error: "Project not found" });
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
