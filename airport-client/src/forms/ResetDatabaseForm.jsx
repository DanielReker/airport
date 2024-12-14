import React, {useState} from 'react';
import {Button, Checkbox, FormControlLabel, Paper, Typography} from "@mui/material";
import {resetDatabase} from "../api/tables.js";

const ResetDatabaseForm = () => {
    const [ loadSampleData, setLoadSampleData ] = useState(false);

    return (
        <>
            <Typography variant='h6' gutterBottom>Reset database</Typography>
            <FormControlLabel control={
                <Checkbox value={loadSampleData} onChange={(e, checked) => setLoadSampleData(checked)} />
            } label="Load sample data" />
            <Button variant='contained' onClick={() => resetDatabase(loadSampleData)}>Reset</Button>
        </>
    );
};

export default ResetDatabaseForm;