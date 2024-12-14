import React, {useState} from 'react';
import {Button, Checkbox, FormControlLabel, Paper, Typography} from "@mui/material";
import {resetDatabase} from "../api/tables.js";
import {useNotifications} from "@toolpad/core";

const ResetDatabaseForm = () => {
    const [ loadSampleData, setLoadSampleData ] = useState(false);
    const notifications = useNotifications();

    const handleResetDatabaseClick = async (loadSampleData) => {
        try {
            await resetDatabase(loadSampleData);
            notifications.show('Successful database reset', {
                severity: 'success',
                autoHideDuration: 3000,
            });
        } catch (e) {
            notifications.show('Database reset failed', {
                severity: 'error',
                autoHideDuration: 3000,
            });
        }
    }

    return (
        <>
            <Typography variant='h6' gutterBottom>Reset database</Typography>
            <FormControlLabel control={
                <Checkbox value={loadSampleData} onChange={(e, checked) => setLoadSampleData(checked)} />
            } label="Load sample data" />
            <Button variant='contained' onClick={() => handleResetDatabaseClick(loadSampleData)}>Reset</Button>
        </>
    );
};

export default ResetDatabaseForm;