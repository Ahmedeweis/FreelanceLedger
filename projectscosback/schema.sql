-- 0. Ensure UUID extension is available (for older Postgres versions)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create the project_status ENUM
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('new', 'completed', 'pending', 'at_risk', 'canceled');
    END IF;
END $$;

-- 2. Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status project_status DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create the income_entries table
CREATE TABLE IF NOT EXISTS income_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description VARCHAR(255),
    is_received BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create the project_balances View
CREATE OR REPLACE VIEW project_balances AS
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
