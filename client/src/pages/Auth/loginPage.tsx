import Login from "../../components/Login/LoginInput";
import useRecovery from "../../context/RecoveryProvider";
import OTPinput from "../../components/Login/OTPinput";
import Reset from "../../components/Login/Reset";
import ForgotPassword from "../../components/Login/ForgotPassword";
import Recovered from "../../components/Login/Recovered";

const LoginPage = () => {
  const { page } = useRecovery();

  const NavigateComponents = () => {
    if (page === "login") return <Login />;
    if (page === "otp") return <OTPinput />;
    if (page === "reset") return <Reset />;
    if (page === "forgot-password") return <ForgotPassword />;

    return <Recovered />;
  };

  return (
    <div className="">
      <NavigateComponents />
    </div>
  );
};

export default LoginPage;
