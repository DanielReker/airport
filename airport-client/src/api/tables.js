const apiUrl = import.meta.env.VITE_API_URL;


export const resetDatabase = async (loadSampleData) => {
    await fetch(`${apiUrl}/tables`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'reset',
            loadSampleData: loadSampleData,
        }),
    });
};

export const getTablesSchema = async () => {
    return await (await fetch(`${apiUrl}/tables`)).json();
};

export const getTable = async (tableName) => {
    return await (await fetch(`${apiUrl}/tables/${tableName}`)).json();
};

export const deleteFromTable = async (tableName, rowId) => {
    await fetch(`${apiUrl}/tables/${tableName}/${rowId}`, { method: 'DELETE' });
};

export const updateTable = async (tableName, rowId, rowData) => {
    await fetch(`${apiUrl}/tables/${tableName}/${rowId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rowData),
    });
};

export const insertIntoTable = async (tableName, rowData) => {
    await fetch(`${apiUrl}/tables/${tableName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rowData),
    });
};