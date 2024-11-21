import {Box, MenuItem, Select, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {DataGrid} from "@mui/x-data-grid";

const DataPage = () => {
    const tables = useQuery({
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tables`);
            return await response.json();
        },
        queryKey: ['tables'],
        //staleTime: Infinity,
    }).data || { airports: { name: "Airports", columns: {} } };

    const [ selectedTable, setSelectedTable ] = useState('airports');

    let tableData = useQuery({
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/tables/${selectedTable}`);
            return await response.json();
        },
        queryKey: ['tableData', selectedTable],
        //staleTime: Infinity,
    }).data || [];

    const tablesList = Object.keys(tables).map((key) => key);
    const renderedTablesList = tablesList.map(table => <MenuItem key={table} value={table}>{tables[table]['printableName']}</MenuItem>);

    const columns = Object.keys(tables[selectedTable]['columns']).map((column) => {
        return {
            field: tables[selectedTable]['columns'][column]['name'],
            headerName: tables[selectedTable]['columns'][column]['printableName'],
            position: tables[selectedTable]['columns'][column]['position'],
        };
    }).sort((leftColumn, rightColumn) => leftColumn.position - rightColumn.position);

    return (
        <Box>
            <Select sx={{ mb: 2 }} value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                {renderedTablesList}
            </Select>
            <DataGrid rows={tableData} columns={columns} />
        </Box>
    );
};

export default DataPage;