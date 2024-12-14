import {Box, Button, MenuItem, Select} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
    GridToolbarContainer
} from "@mui/x-data-grid";
import {deleteFromTable, getTable, getTablesSchema, insertIntoTable, updateTable} from "../api/tables.js";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {useNotifications} from "@toolpad/core";

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = '';
        setRows((oldRows) => [
            ...oldRows,
            { id, isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

const DataPage = () => {
    const notifications = useNotifications();

    const tables = useQuery({
        queryFn: getTablesSchema,
        queryKey: ['tables'],
    }).data || { airports: { name: "Airports", columns: {} } };

    const [ selectedTable, setSelectedTable ] = useState('airports');

    let { data: tableData, refetch: refetchData } = useQuery({
        queryFn: () => getTable(selectedTable),
        queryKey: ['tableData', selectedTable],
    });
    tableData = tableData || [];

    const [rows, setRows] = useState(null);
    useEffect(() => {
        setRows(tableData);
    }, [tableData]);

    const [rowModesModel, setRowModesModel] = useState({});

    const tablesList = Object.keys(tables).map((key) => key);
    const renderedTablesList = tablesList.map(table => <MenuItem key={table} value={table}>{tables[table]['printableName']}</MenuItem>);


    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        try {
            await deleteFromTable(selectedTable, id);
            notifications.show('Successful delete', {
                severity: 'success',
                autoHideDuration: 3000,
            });
        } catch (e) {
            notifications.show(`Delete failed: ${e.message}`, {
                severity: 'error',
                autoHideDuration: 3000,
            });
        }
        await refetchData();
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow, oldRow) => {
        if (newRow.isNew) {
            try {
                delete newRow.isNew;
                delete newRow.id;
                const inserted = await insertIntoTable(selectedTable, newRow);
                notifications.show('Successful insert', {
                    severity: 'success',
                    autoHideDuration: 3000,
                });
                await refetchData();
                return inserted;
            } catch (e) {
                notifications.show(`Insert failed: ${e.message}`, {
                    severity: 'error',
                    autoHideDuration: 3000,
                });
                return oldRow;
            }
        } else {
            try {
                await updateTable(selectedTable, newRow.id, newRow);
                notifications.show('Successful update', {
                    severity: 'success',
                    autoHideDuration: 3000,
                });
                return newRow;
            } catch (e) {
                notifications.show(`Update failed: ${e.message}`, {
                    severity: 'error',
                    autoHideDuration: 3000,
                });
                return oldRow;
            }
        }
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };


    let columns = Object.keys(tables[selectedTable]['columns']).map((column) => {
        let columnDefinition = {
            field: tables[selectedTable]['columns'][column]['name'],
            headerName: tables[selectedTable]['columns'][column]['printableName'],
            position: tables[selectedTable]['columns'][column]['position'],
            type: tables[selectedTable]['columns'][column]['dataType'],
            editable: true
        };

        if (columnDefinition.field === 'id')
            columnDefinition.editable = false;

        if (columnDefinition.type === 'dateTime') {
            columnDefinition.valueGetter = (value) => {
                return new Date(value);
            }
        }

        return columnDefinition;
    }).sort((leftColumn, rightColumn) => leftColumn.position - rightColumn.position);
    columns.push({
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                    <GridActionsCellItem
                        icon={<SaveIcon />}
                        label="Save"
                        sx={{
                            color: 'primary.main',
                        }}
                        onClick={handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCancelClick(id)}
                        color="inherit"
                    />,
                ];
            }

            return [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                />,
            ];
        },
    });


    return (
        <Box>
            <Select sx={{ mb: 2 }} value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                {renderedTablesList}
            </Select>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{ toolbar: EditToolbar }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </Box>
    );
};

export default DataPage;