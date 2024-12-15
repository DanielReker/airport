const apiUrl = import.meta.env.VITE_API_URL;


export const resetDatabase = async (loadSampleData) => {
    const res = await fetch(`${apiUrl}/tables`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'reset',
            loadSampleData: loadSampleData,
        }),
    });
    if (!res.ok)
        throw new Error(res.statusText);
};

export const getTablesSchema = async () => {
    return await (await fetch(`${apiUrl}/tables`)).json();
};

export const getTable = async (tableName) => {
    return await (await fetch(`${apiUrl}/tables/${tableName}`)).json();
};

export const deleteFromTable = async (tableName, rowId) => {
    const res = await fetch(`${apiUrl}/tables/${tableName}/${rowId}`, { method: 'DELETE' });
    if (!res.ok)
        throw new Error(res.statusText);
};

export const updateTable = async (tableName, rowId, rowData) => {
    const res = await fetch(`${apiUrl}/tables/${tableName}/${rowId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rowData),
    });
    if (!res.ok)
        throw new Error(res.statusText);
};

export const insertIntoTable = async (tableName, rowData) => {
    const res = await fetch(`${apiUrl}/tables/${tableName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rowData),
    });
    if (!res.ok)
        throw new Error(res.statusText);

    return res.json();
};