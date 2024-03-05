import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Login from "./Auth/login";
import Register from "./Auth/register";
import RequireAuth from "./../components/RequireAuth/index";
import ErrorPage from "./error-page";
import Profile from "./User/Profile";
import Users from "./User/Users";
import "../index.css";
import Unauthorized from "../components/Unauthrorized";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Home from "./User/Home";
import { getUser } from "../services/userServices";
import "rsuite/dist/rsuite-no-reset.min.css";

import useEmployeeStore, {
  TEmployeeStoreState,
} from "../context/EmployeeProvider";
import { axiosPrivate } from "../services/httpClient";
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
          <div className="flex justify-center ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { employee }: TEmployeeStoreState = useEmployeeStore();
  useEffect(() => {
    console.log(auth);

    if (!auth.id) {
      navigate("/login", { state: { from: "/" }, replace: true });
    }
  }, [auth.id, navigate]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
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
