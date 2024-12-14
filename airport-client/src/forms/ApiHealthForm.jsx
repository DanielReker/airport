import React from 'react';
import {Button, Typography} from "@mui/material";
import {getHealth} from "../api/health.js";
import {useQuery} from "@tanstack/react-query";

const ApiHealthForm = () => {
    const { data: apiHealth, refetch: refetchApiHealth } = useQuery({
        queryFn: getHealth,
        queryKey: [ 'apiHealth' ],
    });

    return (
        <>
            <Typography variant='h6' gutterBottom>API health check</Typography>
            <Typography gutterBottom>API URL: {import.meta.env.VITE_API_URL}</Typography>
            <Typography gutterBottom>Uptime: {apiHealth?.['uptime']}</Typography>
            <Typography gutterBottom>Date: {apiHealth?.['date']}</Typography>
            <Typography gutterBottom>Database healthy: {apiHealth?.['databaseHealthy'] ? 'yes' : 'no'}</Typography>
            { apiHealth?.['databaseError'] && (<Typography gutterBottom>Database error: {apiHealth?.['databaseError']}</Typography>) }
            <Button variant='contained' onClick={() => refetchApiHealth()}>Refresh</Button>

        </>
    );
};

export default ApiHealthForm;