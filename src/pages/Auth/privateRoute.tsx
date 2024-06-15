import React from "react";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className=" mx-auto">
        <div className="h-dvh">
          <Navbar />
          <div className="flex justify-center ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

const PrivateRoute = () => {
  const { auth } = useAuth();
  console.log("auth", auth);

  if (!auth.id) {
    return <Navigate to="/login" /> || <Navigate to="/register" />;
  }

  return (
    <>
      <div className=" mx-auto">
        <div className="h-dvh">
          <Navbar />
          <div className="flex justify-center ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivateRoute;