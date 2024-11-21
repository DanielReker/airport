import {extendTheme} from '@mui/material/styles';
import FlightIcon from '@mui/icons-material/Flight';
import {AppProvider} from '@toolpad/core/react-router-dom';
import {Outlet} from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TableChartIcon from '@mui/icons-material/TableChart';
import {SessionProvider} from "./contexts/SessionContext.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const NAVIGATION = [
    {
        kind: 'header',
        title: 'Pages',
    },
    {
        title: 'Data',
        icon: <TableChartIcon />,
    },
    {
        segment: 'admin',
        title: 'Admin',
        icon: <AdminPanelSettingsIcon />,
    },
];

const BRANDING = {
    logo: <FlightIcon color='primary' fontSize='large'/>,
    title: 'Airport',
};

const theme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    shape: {
        borderRadius: 8
    },
});

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <AppProvider
                    navigation={NAVIGATION}
                    theme={theme}
                    branding={BRANDING}
                >
                    <Outlet/>
                </AppProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}
