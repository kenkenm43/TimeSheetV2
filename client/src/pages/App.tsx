import { Route, Routes } from "react-router-dom";
import LoginPage from "./Auth/loginPage";
import RegisterPage from "./Auth/register";
import RequireAuth from "./../components/RequireAuth/index";
import ErrorPage from "./error-page";
import Profile from "./User/Profile";
import Users from "./User/Users";
import DashBoard from "./Admin/dashBoard";
import "../index.css";
import Unauthorized from "../components/Unauthrorized";
import Home from "./User/Home";
import "rsuite/dist/rsuite-no-reset.min.css";
import Employee from "./Admin/employees";

import PrivateRoute from "./Auth/privateRoute";
import ListEmployee from "./Admin/listEmployee";
import ForgotPassword from "./Auth/forgot-password";
const ROLES = {
  Admin: "admin",
  User: "user",
};

function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="" element={<PrivateRoute />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/users" element={<Users />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/list" element={<ListEmployee />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/employee" element={<Employee />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
