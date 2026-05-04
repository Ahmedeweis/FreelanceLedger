import pool from '../db.js';

export const getLedger = async (req, res) => {
    try {
        // 1. Total Earned Ever (all received income)
        const totalEarnedResult = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) AS total_earned FROM income_entries WHERE is_received = true"
        );
        const totalEarned = parseFloat(totalEarnedResult.rows[0].total_earned);

        // 2. This Month's Income (received in current month/year)
        const thisMonthResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS this_month_income 
            FROM income_entries 
            WHERE is_received = true 
            AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
        `);
        const thisMonthIncome = parseFloat(thisMonthResult.rows[0].this_month_income);

        // 3. Pending Breakdown
        // 3a. From Projects (where remaining_balance > 0)
        const pendingProjectsResult = await pool.query(`
            SELECT project_id, project_name, remaining_balance, status 
            FROM project_balances 
            WHERE remaining_balance > 0
        `);
        
        // 3b. From Standalone entries (where is_received = false)
        const pendingStandaloneResult = await pool.query(`
            SELECT id, description, amount, date 
            FROM income_entries 
            WHERE is_received = false AND project_id IS NULL
        `);

        // Compute Total Pending
        const totalPendingProjects = pendingProjectsResult.rows.reduce((sum, p) => sum + parseFloat(p.remaining_balance), 0);
        const totalPendingStandalone = pendingStandaloneResult.rows.reduce((sum, s) => sum + parseFloat(s.amount), 0);
        const totalPending = totalPendingProjects + totalPendingStandalone;

        const pendingBreakdown = {
            total_pending: totalPending,
            projects: pendingProjectsResult.rows.map(p => ({
                id: p.project_id,
                name: p.project_name,
                status: p.status,
                amount: parseFloat(p.remaining_balance)
            })),
            standalone: pendingStandaloneResult.rows.map(s => ({
                id: s.id,
                description: s.description,
                date: s.date,
                amount: parseFloat(s.amount)
            }))
        };

        // 4. Monthly Timeline (Grouped by YYYY-MM) starting from Jan 2023
        // We fetch all income entries (both received and not received, or maybe just received?)
        // The user asked for "a list of project payments and manual entries that happened in that specific month". 
        // We will include all entries to show timeline.
        const timelineResult = await pool.query(`
            SELECT 
                ie.id, ie.amount, ie.date, ie.description, ie.is_received,
                TO_CHAR(ie.date, 'YYYY-MM') as month_key,
                TO_CHAR(ie.date, 'Month YYYY') as month_name,
                p.name as project_name, p.status as project_status, p.id as project_id
            FROM income_entries ie
            LEFT JOIN projects p ON ie.project_id = p.id
            WHERE ie.date >= '2023-01-01'
            ORDER BY ie.date DESC
        `);

        // Group the timeline data by month_key
        const timeline = [];
        const monthMap = new Map();

        // Pre-fill all months from current date (or latest entry date) down to Jan 2023
        let latestDate = new Date();
        if (timelineResult.rows.length > 0) {
            const firstRowDate = new Date(timelineResult.rows[0].date);
            if (firstRowDate > latestDate) {
                latestDate = firstRowDate;
            }
        }

        let currentYear = latestDate.getFullYear();
        let currentMonth = latestDate.getMonth(); // 0-11

        const startYear = 2023;
        const startMonth = 0; // January

        while (currentYear > startYear || (currentYear === startYear && currentMonth >= startMonth)) {
            const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
            const dateObj = new Date(currentYear, currentMonth, 1);
            const monthName = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            
            const newMonthObj = {
                month_key: monthKey,
                month_name: monthName,
                total_received: 0,
                entries: []
            };
            monthMap.set(monthKey, newMonthObj);
            timeline.push(newMonthObj);
            
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
        }

        for (const row of timelineResult.rows) {
            if (!monthMap.has(row.month_key)) {
                const newMonthObj = {
                    month_key: row.month_key,
                    month_name: row.month_name.trim(),
                    total_received: 0,
                    entries: []
                };
                monthMap.set(row.month_key, newMonthObj);
                timeline.push(newMonthObj);
            }

            const monthObj = monthMap.get(row.month_key);
            if (row.is_received) {
                monthObj.total_received += parseFloat(row.amount);
            }

            monthObj.entries.push({
                id: row.id,
                amount: parseFloat(row.amount),
                date: row.date,
                description: row.description,
                is_received: row.is_received,
                project: row.project_id ? {
                    id: row.project_id,
                    name: row.project_name,
                    status: row.project_status
                } : null
            });
        }

        res.json({
            summary: {
                total_earned: totalEarned,
                this_month_income: thisMonthIncome,
                pending: pendingBreakdown
            },
            timeline: timeline
        });
    } catch (error) {
        console.error("Error fetching ledger:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
