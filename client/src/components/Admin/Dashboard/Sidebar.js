import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { getEmployees } from "../../../services/adminServices";
import { logout } from "../../../services/authServices";
import useKeepEmployeeStore from "../../../context/KeepEmployeeProvider";
import useKeepEmployeesStore from "../../../context/KeepEmployeesProvider";
import useEmployeeStore from "../../../context/EmployeeProvider";
const Sidebar = () => {
    const { employees, setEmployees } = useKeepEmployeesStore();
    const { employee } = useEmployeeStore();
    const { keepEmployee, setKeepEmployee } = useKeepEmployeeStore();
    const getEmployeesData = (payload) => {
        return getEmployees(payload);
    };
    console.log("employeeStore", employee);
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getEmployeesData({ roleQuery: "user" });
            console.log("update data");
            console.log("data", data);
            setEmployees(data);
            setIsOpenListEmployees(location.pathname == "/employee" ? true : false);
            setKeepEmployee(data[0]);
        };
        fetchData();
    }, []);
    console.log("employee", employees);
    const selectEmployee = (emp) => {
        if (!(keepEmployee.id === emp.id)) {
            setKeepEmployee(emp);
        }
    };
    const [isOpenListEmployees, setIsOpenListEmployees] = useState(true);
    const links = [
        {
            id: 1,
            title: "Dashboard",
            icon: _jsx(RxDashboard, {}),
            link: "/dashboard",
        },
        {
            id: 2,
            title: "Employee",
            icon: _jsx(FaUser, {}),
            link: "/employee",
        },
    ];
    const logoutItem = {
        id: 1,
        title: "Logout",
        icon: _jsx(FiLogOut, {}),
        link: "/logout",
    };
    const openListEmployees = () => {
        setIsOpenListEmployees(true);
    };
    const closeListEmployees = () => {
        setIsOpenListEmployees(false);
    };
    return (_jsxs("aside", { className: `fixed top-0 z-40 ${isOpenListEmployees ? "w-72" : "w-72"} flex transition-all translate-x-0 h-svh
       duration-700
      `, children: [_jsx("div", { className: `transition-all duration-700 translate-x-0 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 ${isOpenListEmployees ? "w-16" : "w-60"}`, children: _jsxs("ul", { className: "flex flex-col space-y-2 font-medium h-full justify-between", children: [_jsx("div", { children: links?.map((nav, index) => (_jsx("li", { children: nav.title === "Employee" ? (_jsx(_Fragment, { children: _jsxs(Link, { to: nav.link, className: `flex items-center p-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group `, onClick: openListEmployees, children: [nav.icon, !isOpenListEmployees && (_jsx("span", { className: "ms-3", children: "\u0E23\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19" }))] }) })) : (_jsx(_Fragment, { children: _jsxs(Link, { to: nav.link, className: "flex items-center p-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group", onClick: closeListEmployees, children: [nav.icon, !isOpenListEmployees && (_jsx("span", { className: "ms-3", children: nav.title }))] }) })) }, index))) }), _jsxs("button", { className: "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group", onClick: () => logout(), children: [logoutItem.icon, !isOpenListEmployees && (_jsx("span", { className: "ms-3", children: logoutItem.title }))] })] }) }), _jsxs("div", { className: `transition-all -translate-x-0 duration-700 h-screen py-6 overflow-y-auto bg-white border-l border-r  ${isOpenListEmployees ? "w-56" : "w-0 "} dark:bg-gray-900 dark:border-gray-700`, children: [_jsx("h2", { className: "px-5 text-lg font-medium text-gray-800 dark:text-white", children: "\u0E23\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19" }), employees.length !== 0 ? (employees?.map((emp, idx) => (_jsx("div", { className: "mt-3 space-y-1", children: _jsxs("button", { onClick: () => selectEmployee(emp), className: `flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none
                ${emp?.id === keepEmployee?.id ? "bg-gray-100" : ""} 
                `, children: [emp.photo ? (_jsx("img", { className: "object-cover w-8 h-8 rounded-full", src: `http://localhost:8081/${emp.photo}`, alt: "img" })) : (_jsx("img", { className: "object-cover w-8 h-8 rounded-full", src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&h=880&q=80", alt: "img" })), _jsx("div", { className: "text-left rtl:text-right", children: _jsxs("h1", { className: "text-sm font-medium text-gray-700 capitalize dark:text-white", children: [_jsx("div", { children: emp?.firstName }), _jsx("div", { children: emp?.lastName })] }) })] }) }, idx)))) : (_jsx(_Fragment, { children: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D" }))] })] }));
};
export default Sidebar;
