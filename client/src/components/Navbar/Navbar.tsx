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
    // ปรับ Navbar ให้ติดหนึบด้านบน (Sticky) และใส่เอฟเฟกต์เบลอ (Glassmorphism)
    <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="flex items-center justify-between px-6 md:px-14 h-16 max-w-7xl mx-auto">
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* สามารถใส่ Logo ตรงนี้ได้ */}
          <div className="text-xl font-extrabold text-orange-500 mr-4 cursor-pointer" onClick={() => navigate("/")}>
            TimeSheet
          </div>

          <div className="hidden md:flex space-x-6 font-medium text-gray-600">
            {navLists.map((nav, index) => (
              <span key={index}>
                {nav.authorization?.includes(auth?.role?.name) && (
                  <Link 
                    to={nav.to} 
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    {nav.name}
                  </Link>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {auth?.username ? (
            <>
              {/* Profile Button */}
              <button 
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-3 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700 hidden md:block">
                  {auth.username}
                </span>
                <img
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-100 hover:ring-orange-400 transition-all duration-300"
                  src={
                    employee?.photo || 
                    "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                  }
                  alt="Profile"
                />
              </button>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition-all duration-200"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              {/* Guest Links */}
              <Link 
                to="/login" 
                className="font-medium text-gray-600 hover:text-orange-500 px-4 py-2 transition-colors"
              >
                ลงชื่อเข้าใช้
              </Link>
              <Link 
                to="/register" 
                className="font-medium bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              >
                ลงทะเบียน
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;