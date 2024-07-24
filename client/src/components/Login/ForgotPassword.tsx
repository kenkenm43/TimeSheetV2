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
import { sendOTPtoEmail, validateResetPassword } from "../../helpers/validate";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useEmployeeStore from "../../context/EmployeeProvider";
import Button from "../../components/Form/Button";
import useRecovery from "../../context/RecoveryProvider";
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { email, setPage, setOTP, setEmail } = useRecovery();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(sendOTPtoEmail),
  });

  const navigateToOtp = async (datas: any) => {
    setIsLoading(true);
    console.log(datas);
    try {
      if (datas.email) {
        console.log("sed");

        const OTP = Math.floor(Math.random() * 9000 + 1000);
        setOTP(OTP);
        setEmail(datas.email);
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
    <Form onSubmit={handleSubmit(navigateToOtp)}>
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
