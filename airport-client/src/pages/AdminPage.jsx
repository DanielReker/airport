import React, {useEffect, useState} from 'react';
import {Box, Button, Checkbox, FormControlLabel, Paper, Typography} from "@mui/material";
import ResetDatabaseForm from "../forms/ResetDatabaseForm.jsx";
import ApiHealthForm from "../forms/ApiHealthForm.jsx";


const AdminPage = () => {
    return (
        <Box>
            <Paper elevation={3} sx={{ p: 1 }}>
                <ApiHealthForm/>
            </Paper>

            <Paper elevation={3} sx={{ p: 1, mt: 2 }}>
                <ResetDatabaseForm/>
            </Paper>
        </Box>


    );
};

export default AdminPage;