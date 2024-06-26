import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../services/authServices";
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
                {auth.username}
              </button>

              <button onClick={() => logout()}>ออกจากระบบ</button>
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
