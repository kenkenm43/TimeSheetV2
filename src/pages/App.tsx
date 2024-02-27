import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Login from "./Auth/login";
import Register from "./Auth/register";
import RequireAuth from "./../components/RequireAuth/index";
import ErrorPage from "./error-page";
import Profile from "./User/Profile";
import Users from "./User/Users";
import "../index.css";
import Unauthorized from "../components/Unauthrorized";
// import useStore from "../store";
const ROLES = {
  Admin: "admin",
  User: "user",
};

const Layout = () => {
  return (
    <>
      <div className=" mx-auto">
        <div className="h-dvh">
          <Navbar />
          <div className="flex justify-center mt-14 mb-14">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  // const count = useStore((state) => state?.count);
  // const setCount = useStore((state) => state?.setCount);
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        {/* <Route path="linkpage" element={<LinkPage />} /> */}
        <Route path="/" element={<Profile />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route
          element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}
        ></Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="users" element={<Users />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
