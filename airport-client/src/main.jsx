import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {StyledEngineProvider} from "@mui/material";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DataPage from "./pages/DataPage.jsx";


const router = createBrowserRouter([
    {
        Component: App,
        children: [
            {
                path: '/',
                Component: Layout,
                children: [
                    {
                        path: '',
                        Component: DataPage,
                    },
                    {
                        path: 'admin',
                        Component: AdminPage,
                    }
                ],
            },
            {
                path: '/sign-in',
                Component: LoginPage,
            }
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <StyledEngineProvider injectFirst>
            <RouterProvider router={router} />
        </StyledEngineProvider>
    </StrictMode>
)
