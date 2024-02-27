import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type TNavigation = {
  name: string;
  authorization?: string[];
  to: string;
};

const navLists: TNavigation[] = [
  {
    name: "TimeSheet",
    authorization: ["user", "admin"],
    to: "/",
  },
  {
    name: "ข้อมูลส่วนตัว",
    authorization: ["user", "admin"],
    to: "/profile",
  },
  {
    name: "all user",
    authorization: ["admin"],
    to: "/users",
  },
];

const Navbar = () => {
  const { auth } = useAuth();
  return (
    <nav className="w-full  bg-orange-400  font-bold">
      <div className="flex items-center justify-between px-14 h-14 max-w-7xl mx-auto">
        <div className="space-x-5 font-bold">
          {navLists.map((nav) => (
            <Link key={nav.name} to={nav.to}>
              {nav.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {auth.username ? (
            <>
              <div className="w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center">
                2
              </div>
              <Link to="/login">ออกจากระบบ</Link>
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
