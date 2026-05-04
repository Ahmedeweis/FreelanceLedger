export const API_URL = 'http://localhost:5000/api';

export const getLedger = async () => {
    try {
        const response = await fetch(`${API_URL}/ledger/monthly-ledger`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching ledger:", error);
        throw error;
    }
};

export const getProjects = async () => {
    try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

export const createProject = async (data) => {
    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

export const createIncome = async (data) => {
    try {
        const response = await fetch(`${API_URL}/income`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error creating income:", error);
        throw error;
    }
};

export const updateProject = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};

export const updateIncome = async (id, data) => {
    try {
        const response = await fetch(`${API_URL}/income/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error updating income:", error);
        throw error;
    }
};

export const deleteIncome = async (id) => {
    try {
        const response = await fetch(`${API_URL}/income/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error deleting income:", error);
        throw error;
    }
};
