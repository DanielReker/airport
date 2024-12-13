import React, {useEffect, useState} from 'react';
import {Button, Typography} from "@mui/material";

const ApiHealthForm = () => {
    const [apiHealth, setApiHealth] = useState({
        uptime: 0,
        message: "Unknown",
        date: "unknown",
        databaseHealthy: false,
        databaseError: null,
    });

    const updateApiHealth = () => {
        fetch(`${import.meta.env.VITE_API_URL}/health`).then(res => res.json()).then((hello) => setApiHealth(hello));
    };

    useEffect(() => {
        updateApiHealth();
    }, []);

    return (
        <>
            <Typography variant='h6' gutterBottom>API health check</Typography>
            <Typography gutterBottom>API URL: {import.meta.env.VITE_API_URL}</Typography>
            <Typography gutterBottom>Uptime: {apiHealth.uptime}</Typography>
            <Typography gutterBottom>Date: {apiHealth.date}</Typography>
            <Typography gutterBottom>Database healthy: {apiHealth.databaseHealthy ? 'yes' : 'no'}</Typography>
            { apiHealth.databaseError && (<Typography gutterBottom>Database error: {apiHealth.databaseError}</Typography>) }
            <Button variant='contained' onClick={() => updateApiHealth()}>Refresh</Button>

        </>
    );
};

export default ApiHealthForm;