import {Box, MenuItem, Select} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {getTable, getTablesSchema} from "../api/tables.js";

const DataPage = () => {
    const tables = useQuery({
        queryFn: getTablesSchema,
        queryKey: ['tables'],
    }).data || { airports: { name: "Airports", columns: {} } };

    const [ selectedTable, setSelectedTable ] = useState('airports');

    let tableData = useQuery({
        queryFn: () => getTable(selectedTable),
        queryKey: ['tableData', selectedTable],
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