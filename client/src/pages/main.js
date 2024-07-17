import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../index.css";
import Toastify from "../components/Toastify/index.tsx";
import { CookiesProvider } from "react-cookie";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(_Fragment, { children: _jsx(CookiesProvider, { children: _jsxs(BrowserRouter, { children: [_jsx(Toastify, {}), _jsx(Routes, { children: _jsx(Route, { path: "/*", element: _jsx(App, {}) }) })] }) }) }));
