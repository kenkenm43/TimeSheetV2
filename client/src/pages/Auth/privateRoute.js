import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../../Enum/Role";
import Sidebar from "../../components/Admin/Dashboard/Sidebar";
const PrivateRoute = () => {
    const { auth } = useAuth();
    console.log(auth.role.name);
    if (!auth.id) {
        return _jsx(Navigate, { to: "/login" }) || _jsx(Navigate, { to: "/register" });
    }
    return (_jsx(_Fragment, { children: _jsx("div", { className: " mx-auto relative", children: _jsxs("div", { className: "h-dvh", children: [auth?.role?.name === ROLES.User && _jsx(Navbar, {}), auth?.role?.name === ROLES.Admin && _jsx(Sidebar, {}), _jsx("div", { className: `${auth.role.name === ROLES.User
                            ? "flex justify-center"
                            : "ml-64 transition-all "}`, children: _jsx(Outlet, {}) })] }) }) }));
};
export default PrivateRoute;
