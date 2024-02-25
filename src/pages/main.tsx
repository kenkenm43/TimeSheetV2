import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import Navbar from "../components/Navbar/Navbar.tsx";
import Profile from "./User/Profile.tsx";
import "../index.css";
import Login from "../pages/Auth/login.tsx";
import Register from "../pages/Auth/register.tsx";

const AppLayout = () => {
  return (
    <>
      <div className=" mx-auto">
        <div className="h-dvh">
          <Navbar />
          <div className="flex justify-center mt-14">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>
);
