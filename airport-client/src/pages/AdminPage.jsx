import React, {useEffect, useState} from 'react';
import {Box, Button, Checkbox, FormControlLabel, Paper, Typography} from "@mui/material";
import ResetDatabaseForm from "../forms/ResetDatabaseForm.jsx";


const AdminPage = () => {
    const [apiHealth, setApiHealth] = useState({
        uptime: 0,
        message: "Unknown",
        date: "unknown",
        databaseConnected: false
    });

    const updateApiHealth = () => {
        fetch(`${import.meta.env.VITE_API_URL}/health`).then(res => res.json()).then((hello) => setApiHealth(hello));
    };



    useEffect(() => {
        updateApiHealth();
    }, []);

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 1 }}>
                <Typography variant='h6' gutterBottom>API health check</Typography>
                <Typography gutterBottom>API URL: {import.meta.env.VITE_API_URL}</Typography>
                <Typography gutterBottom>Message: {apiHealth['message']}</Typography>
                <Typography gutterBottom>Uptime: {apiHealth['uptime']}</Typography>
                <Typography gutterBottom>Date: {apiHealth['date']}</Typography>
                <Typography gutterBottom>Database connected: {apiHealth['databaseConnected'] ? 'yes' : 'no'}</Typography>
                <Button variant='contained' onClick={(e) => updateApiHealth()}>Refresh</Button>
            </Paper>


            <Paper elevation={3} sx={{ p: 1, mt: 2 }}>
                <ResetDatabaseForm/>
            </Paper>
        </Box>


    );
};

export default AdminPage;