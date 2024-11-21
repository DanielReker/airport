import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import {PageContainer} from "@toolpad/core";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useSession} from '../contexts/SessionContext.jsx';

const Layout = () => {
    const { session } = useSession();
    const location = useLocation();

    if (!session) {
        const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

        // TODO: Implement authentication
        // return <Navigate to={redirectTo} replace />
    }

    return (
        <DashboardLayout>
            <PageContainer>
                <Outlet />
            </PageContainer>
        </DashboardLayout>
    );
};

export default Layout;