import { Route, Routes } from "react-router-dom";
import Login from "./Auth/login";
import RegisterPage from "./Auth/register";
import RequireAuth from "./../components/RequireAuth/index";
import ErrorPage from "./error-page";
import Profile from "./User/Profile";
import Users from "./User/Users";
import "../index.css";
import Unauthorized from "../components/Unauthrorized";
import Home from "./User/Home";
import "rsuite/dist/rsuite-no-reset.min.css";

import PrivateRoute from "./Auth/privateRoute";
const ROLES = {
  Admin: "admin",
  User: "user",
};

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route
          element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}
        ></Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="users" element={<Users />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
