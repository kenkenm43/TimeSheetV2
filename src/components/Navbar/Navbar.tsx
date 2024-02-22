import { Link } from "react-router-dom";

const navLists = [
  {
    name: "TimeSheet",
    to: "/",
  },
  {
    name: "Profile",
    to: "/profile",
  },
];

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-14 h-14 bg-orange-400">
      <div className="space-x-5 font-bold">
        {navLists.map((nav) => (
          <Link to={nav.to}>{nav.name}</Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center">
          2
        </div>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
