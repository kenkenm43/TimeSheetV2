import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import Login from "./Auth/login";
import RegisterPage from "./Auth/register";
import RequireAuth from "./../components/RequireAuth/index";
import ErrorPage from "./error-page";
import Profile from "./User/Profile";
import Users from "./User/Users";
import DashBoard from "./Admin/dashBoard";
import "../index.css";
import Unauthorized from "../components/Unauthrorized";
import Home from "./User/Home";
import "rsuite/dist/rsuite-no-reset.min.css";
import Employee from "./Admin/employees";
import PrivateRoute from "./Auth/privateRoute";
const ROLES = {
    Admin: "admin",
    User: "user",
};
function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "login", element: _jsx(Login, {}) }), _jsx(Route, { path: "register", element: _jsx(RegisterPage, {}) }), _jsxs(Route, { path: "", element: _jsx(PrivateRoute, {}), children: [_jsx(Route, { element: _jsx(RequireAuth, { allowedRoles: [ROLES.User] }), children: _jsx(Route, { path: "/", element: _jsx(Home, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "unauthorized", element: _jsx(Unauthorized, {}) }), _jsx(Route, { element: _jsx(RequireAuth, { allowedRoles: [ROLES.User] }), children: _jsx(Route, { path: "users", element: _jsx(Users, {}) }) }), _jsx(Route, { element: _jsx(RequireAuth, { allowedRoles: [ROLES.Admin] }), children: _jsx(Route, { path: "dashboard", element: _jsx(DashBoard, {}) }) }), _jsx(Route, { element: _jsx(RequireAuth, { allowedRoles: [ROLES.Admin] }), children: _jsx(Route, { path: "employee", element: _jsx(Employee, {}) }) }), _jsx(Route, { path: "*", element: _jsx(ErrorPage, {}) })] })] }));
}
export default App;
