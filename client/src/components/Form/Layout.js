import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Layout = ({ children, onSubmit }) => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    console.log(auth.id);
    useEffect(() => {
        if (auth.id) {
            navigate("/");
        }
    }, [auth.id, navigate]);
    return (_jsx("div", { className: "max-w-lg mx-auto flex items-center rounded-sm shadow-sm my-8", children: _jsx("div", { className: "transition-all duration-1000 flex justify-center w-full bg-gray-100 rounded-lg shadow-sm h-full", children: _jsx("form", { className: "flex flex-col space-y-5 p-6 w-4/6", onSubmit: onSubmit, children: children }) }) }));
};
export default Layout;
