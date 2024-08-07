import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../services/authServices";
import useEmployeeStore from "../../context/EmployeeProvider";
import { useState } from "react";
import Loading from "../Loading";
type TNavigation = {
  name: string;
  authorization?: string[];
  to: string;
};

const navLists: TNavigation[] = [
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
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <nav className="w-full  bg-orange-400  font-bold">
      <div className="flex items-center justify-between px-14 h-14 max-w-7xl mx-auto">
        <div className="space-x-5 font-bold">
          {navLists.map((nav, index) => (
            <span key={index}>
              {nav.authorization?.includes(auth?.role.name) && (
                <Link to={nav.to}>{nav.name}</Link>
              )}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {auth.username ? (
            <>
              <button onClick={() => navigate("/profile")}>
                <div className="flex items-center space-x-2">
                  <span>{auth.username}</span>
                  {employee.photo ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={employee.photo}
                    />
                  ) : (
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                    />
                  )}
                </div>
              </button>

              <button onClick={handleLogout}>ออกจากระบบ</button>
            </>
          ) : (
            <>
              <Link to="/login">ลงชื่อเข้าใช้</Link>
              <Link to="/register">ลงทะเบียน</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
