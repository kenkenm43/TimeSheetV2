/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../Form/Input";
import Form from "../Form/Layout";
import Topic from "../Form/Topic";
import i18n from "../../i18n/auth.json";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../Form/Button";
import { validateLogin } from "../../helpers/validate";
import { login, resetPassword } from "../../services/authServices";
import useAuth from "../../hooks/useAuth";
import useEmployeeStore from "../../context/EmployeeProvider";
import { getEmployee } from "../../services/employeeServices";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Loading from "../Loading";
import useRecovery from "../../context/RecoveryProvider";
const Login = () => {
  const { setAuth }: any = useAuth();
  const { setEmail, setPage, email, setOTP } = useRecovery();
  const { employee, setEmployee }: any = useEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateLogin),
  });

  const navigateToOtp = async () => {
    try {
      if (email) {
        const OTP = Math.floor(Math.random() * 9000 + 1000);
        setOTP(OTP);
        const otpData = await resetPassword({ recipient_email: email, OTP });
        setPage("otp");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onsubmit = async (datas: any) => {
    setIsLoading(true);
    const response: any = await login(datas);
    const { success, username, message, accessToken, role, employeeId } =
      response.data;

    if (success) {
      setAuth({
        id: uuidv4(),
        username: username,
        employeeId: employeeId,
        accessToken: accessToken,
        role: role,
      });

      const employeeData: any = await getEmployee(employeeId);

      setEmployee({ ...employeeData.data });

      toast.success(message);
      const navigation = (await role?.name) === "admin" ? "/dashboard" : "/";
      await navigate(navigation, {
        replace: true,
        state: { employeeId: employeeData.data.id },
      });
      navigate(0);
    }
    setIsLoading(false);
  };
  return (
    <Form onSubmit={handleSubmit(onsubmit)}>
      {isLoading && <Loading />}
      <Topic message={i18n.auth.login.name} />
      <div></div>
      <Input
        register={register("username")}
        type="text"
        errors={errors.username}
        text="ชื่อผู้ใช้งานหรือเลขบัตรประชาชน"
      />
      <Input
        register={register("password")}
        type="password"
        errors={errors.password}
        text="รหัสผ่าน"
      />
      <div className="flex justify-between">
        <Link to="/register" className="text-blue-500 hover:text-blue-700">
          {i18n.auth.register.name}
        </Link>
        <button
          onClick={() => setPage("forgot-password")}
          className="text-blue-500 hover:text-blue-700"
        >
          {i18n.auth.login["forgot-password"]}
        </button>
      </div>
      <Button text={i18n.auth.login.button} type="submit" />
    </Form>
  );
};

export default Login;
