import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../../Enum/Role";
import Sidebar from "../../components/Admin/Dashboard/Sidebar";
const PrivateRoute = () => {
  const { auth } = useAuth();
  console.log(auth.role.name);

  if (!auth.id) {
    return <Navigate to="/login" /> || <Navigate to="/register" />;
  }

  return (
    <>
      <div className=" mx-auto relative">
        <div className="h-dvh">
          {auth?.role?.name === ROLES.User && <Navbar />}
          {auth?.role?.name === ROLES.Admin && <Sidebar />}
          <div
            className={`${
              auth.role.name === ROLES.User
                ? "flex justify-center"
                : "ml-64 transition-all "
            }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivateRoute;
