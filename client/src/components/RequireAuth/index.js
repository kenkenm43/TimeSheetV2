import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    const isAuthorization = allowedRoles.includes(auth.role.name);
    return isAuthorization ? (_jsx(Outlet, {})) : auth?.username ? (_jsx(Navigate, { to: "/unauthorized", state: { from: location }, replace: true })) : (_jsx(Navigate, { to: "/login", state: { from: location }, replace: true }));
    // return auth?.roles?.find((role: any) => allowedRoles?.includes(role)) ? (
    //   <Outlet />
    // ) : auth?.user ? (
    //   <Navigate to="/unauthorized" state={{ from: location }} replace />
    // ) : (
    //   <Navigate to="/login" state={{ from: location }} replace />
    // );
};
export default RequireAuth;
