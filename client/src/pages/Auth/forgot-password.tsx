/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Topic from "../../components/Form/Topic";
import i18n from "../../i18n/auth.json";
import Loading from "../../components/Loading";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { login, resetPassword } from "../../services/authServices";
import { getEmployee } from "../../services/employeeServices";
import useAuth from "../../hooks/useAuth";
import { sendOTPtoEmail } from "../../helpers/validate";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useEmployeeStore from "../../context/EmployeeProvider";
import Button from "../../components/Form/Button";
import useRecovery from "../../context/RecoveryProvider";
const ForgotPassword = () => {
  const { employee, setEmployee, setOTP }: any = useEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const { email, setPage } = useRecovery();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sendOTPtoEmail),
  });

  // const onsubmit = async (datas: any) => {
  //   const { setAuth }: any = useAuth();
  //   setIsLoading(true);
  //   const response: any = await login(datas);
  //   const { success, username, message, accessToken, role, employeeId } =
  //     response.data;

  //   if (success) {
  //     setAuth({
  //       id: uuidv4(),
  //       username: username,
  //       employeeId: employeeId,
  //       accessToken: accessToken,
  //       role: role,
  //     });

  //     const employeeData: any = await getEmployee(employeeId);

  //     setEmployee({ ...employeeData.data });

  //     toast.success(message);
  //     const navigation = (await role?.name) === "admin" ? "/dashboard" : "/";
  //     await navigate(navigation, {
  //       replace: true,
  //       state: { employeeId: employeeData.data.id },
  //     });
  //     navigate(0);
  //   }
  //   setIsLoading(false);
  // };

  const navigateToOtp = async (datas: any) => {
    setIsLoading(true);
    try {
      if (datas.email) {
        const OTP = Math.floor(Math.random() * 9000 + 1000);
        setOTP(OTP);
        await resetPassword({ recipient_email: datas.email, OTP });
        setPage("otp");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={navigateToOtp(onsubmit)}>
      {isLoading && <Loading />}
      <Topic message={i18n.auth["forgot-password"].name} />
      <div></div>
      <Input
        register={register("email")}
        type="text"
        errors={errors.email}
        text="อีเมล"
      />
      <div className="flex justify-between">
        <button
          onClick={() => {
            setPage("login");
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          {i18n.auth.login.name}
        </button>
      </div>
      <Button text={i18n.auth.login.button} type="submit" />
    </Form>
  );
};

export default ForgotPassword;
