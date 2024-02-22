import { Link } from "react-router-dom";

const navLists = [
  {
    name: "TimeSheet",
    to: "/",
  },
  {
    name: "ข้อมูลส่วนตัว",
    to: "/profile",
  },
];

const Navbar = () => {
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
          <div className="w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center">
            2
          </div>
          <Link to="/login">ลงชื่อเข้าใช้</Link>
          <Link to="/register">ลงทะเบียน</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
