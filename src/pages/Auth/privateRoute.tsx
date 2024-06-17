import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { auth } = useAuth();

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
