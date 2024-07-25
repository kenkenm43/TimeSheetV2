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
import { sendOTPtoEmail, validateResetPassword } from "../../helpers/validate";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Form/Button";
import useRecovery from "../../context/RecoveryProvider";
import Swal from "sweetalert2";
const ForgotPassword = () => {
  const { email, otp, setPage, setOTP, setEmail } = useRecovery();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    resolver: yupResolver(sendOTPtoEmail),
    defaultValues: async () =>
      await resetPassword({ recipient_email: email, OTP: otp }),
  });
  console.log(isLoading);

  const navigateToOtp = async (datas: any) => {
    try {
      console.log("try");

      if (datas.email) {
        console.log(datas.email);

        const OTP = Math.floor(Math.random() * 9000 + 1000);
        setOTP(OTP);
        setEmail(datas.email);
        const response = await resetPassword({
          recipient_email: datas.email,
          OTP,
        });
        console.log(response);
        if (!response) {
          Swal.fire({
            title: "ระบบยังไม่พร้อมใช้งาน!",
            text: "โปรดลองใหม่อีกครั้ง",
            icon: "error",
          });
        } else {
          setPage("otp");
        }
      }
    } catch (error) {
      Swal.fire({
        title: "ระบบยังไม่พร้อมใช้งาน!",
        text: "โปรดลองอีกครั้ง",
        icon: "error",
      });
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <Form onSubmit={handleSubmit(navigateToOtp)}>
        <Topic message={i18n.auth["forgot-password"].name} />
        <div></div>
        <Input
          register={register("email")}
          type="text"
          errors={errors.email}
          text="อีเมล"
        />
        <Button text={i18n.auth.login.button} type="submit" />
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
      </Form>
    </>
  );
};

export default ForgotPassword;
