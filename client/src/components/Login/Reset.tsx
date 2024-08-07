/* eslint-disable @typescript-eslint/no-explicit-any */
import useRecovery from "../../context/RecoveryProvider";
import { changePassword } from "../../services/authServices";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Form/Button";
import Form from "../../components/Form/Layout";
import Topic from "../../components/Form/Topic";
import Input from "../../components/Form/Input";
import { useForm } from "react-hook-form";
import { validateResetPassword } from "../../helpers/validate";
import Loading from "../Loading";
import i18n from "../../i18n/auth.json";
import Swal from "sweetalert2";
import { useState } from "react";

const Reset = () => {
  const { email, setPage } = useRecovery();
  const [password, setPassword] = useState<any>();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    resolver: yupResolver(validateResetPassword),
    defaultValues: async () => await changePassword({ email, password }),
  });

  const onsubmit = async (datas: any) => {
    setPassword(datas.password);
    await changePassword({ email, password: datas.password });
    Swal.fire({
      title: "เปลี่ยนรหัสผ่านเรียบร้อย",
      text: "กลับไปยังหน้าเข้าสู่ระบบ",
      icon: "success",
    });
    setPage("login");
  };
  return (
    <>
      {isLoading && <Loading />}
      <Form onSubmit={handleSubmit(onsubmit)}>
        <Topic message={i18n.auth["forgot-password"].change} />
        <div></div>
        <Input
          register={register("password")}
          type="password"
          errors={errors.password}
          text="รหัสผ่าน"
        />
        <Input
          register={register("confirmPassword")}
          type="password"
          errors={errors.confirmPassword}
          text="ยืนยันรหัสผ่าน"
        />
        <Button text={i18n.auth["forgot-password"].change} type="submit" />
        <div className="flex justify-between">
          <button
            onClick={() => {
              setPage("login");
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            {i18n.auth.login.button}
          </button>
        </div>
      </Form>
    </>
  );
};

export default Reset;
