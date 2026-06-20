import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../../Enum/Role";
import Sidebar from "../../components/Admin/Dashboard/Sidebar";
const PrivateRoute = () => {
  const { auth } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!auth.id) {
    return <Navigate to="/login" /> || <Navigate to="/register" />;
  }

  return (
    <div className="mx-auto relative">
      <div className="h-dvh">
        {auth?.role?.name === ROLES.User && <Navbar />}
        {auth?.role?.name === ROLES.Admin && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        )}
        <div
          className={`transition-all duration-700 ${
            auth.role.name === ROLES.User
              ? "flex justify-center"
              : isSidebarCollapsed
              ? "ml-16"
              : "ml-80"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;
