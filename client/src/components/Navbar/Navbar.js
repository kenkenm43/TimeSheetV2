import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../services/authServices";
import useEmployeeStore from "../../context/EmployeeProvider";
const navLists = [
    {
        name: "TimeSheet",
        authorization: ["user"],
        to: "/",
    },
    {
        name: "TimeSheet",
        authorization: ["admin"],
        to: "/dashboard",
    },
    {
        name: "ข้อมูลส่วนตัว",
        authorization: ["user"],
        to: "/profile",
    },
    {
        name: "พนักงานทั้งหมด",
        authorization: ["admin"],
        to: "/dashboard",
    },
];
const Navbar = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { employee } = useEmployeeStore();
    console.log(employee.photo);
    return (_jsx("nav", { className: "w-full  bg-orange-400  font-bold", children: _jsxs("div", { className: "flex items-center justify-between px-14 h-14 max-w-7xl mx-auto", children: [_jsx("div", { className: "space-x-5 font-bold", children: navLists.map((nav, index) => (_jsx("span", { children: nav.authorization?.includes(auth?.role.name) && (_jsx(Link, { to: nav.to, children: nav.name })) }, index))) }), _jsx("div", { className: "flex items-center space-x-4", children: auth.username ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => navigate("/profile"), children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { children: auth.username }), employee.photo ? (_jsx("img", { className: "h-10 w-10 rounded-full", src: `http://localhost:8081/${employee.photo}` })) : (_jsx("img", { className: "h-10 w-10 rounded-full", src: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg" }))] }) }), _jsx("button", { onClick: () => logout(), children: "\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", children: "\u0E25\u0E07\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49" }), _jsx(Link, { to: "/register", children: "\u0E25\u0E07\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19" })] })) })] }) }));
};
export default Navbar;
