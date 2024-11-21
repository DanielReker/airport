import React, {useState} from 'react';
import {Box, Button, Checkbox, FormControlLabel, Paper, Typography} from "@mui/material";

const ResetDatabaseForm = () => {
    const [ loadSampleData, setLoadSampleData ] = useState(false);

    const resetDatabase = async (loadSampleData) => {
        await fetch(`${import.meta.env.VITE_API_URL}/tables`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'reset',

                loadSampleData: loadSampleData
            })
        });
    };

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