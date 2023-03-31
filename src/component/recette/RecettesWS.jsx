import React from 'react';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import {Tabs, Tab, Box} from '@mui/material';
import { Routes, Route, Link, Navigate, Outlet, useNavigate } from "react-router-dom";

export default function RecettesWs(props) {
    const [value, setValue] = React.useState('');
    let navigate = useNavigate();

    const handleChange = (event, v) => {
        setValue(v);
        navigate("/repas/"+v);
    };

    return (
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="recette tab">
                    <Tab label="Vos recettes" value="" />
                    <Tab label="Recettes partagé avec vous" value="share" disabled />
                </TabList>
            </Box>
            <Outlet />
        </TabContext> 
        
    )

}