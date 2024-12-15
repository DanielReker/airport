import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import {PageContainer} from "@toolpad/core";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const Layout = () => {
    const location = useLocation();

    return (
        <DashboardLayout>
            <PageContainer>
                <Outlet />
            </PageContainer>
        </DashboardLayout>
    );
};

export default Layout;