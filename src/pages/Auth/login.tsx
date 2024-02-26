/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Topic from "../../components/Form/Topic";
import { auth } from "../../i18n/auth.json";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Form/Button";
import { validateLogin } from "../../helpers/validate";
import { login } from "../../services/authServices";
import useAuthStore from "../../context/AuthProvider";
import { shallow } from "zustand/shallow";
import useAuth from "../../hooks/useAuth";
const Login = () => {
  // console.log(auth.username);
  const { count }: any = useAuth();
  console.log(count);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateLogin),
  });

  const onsubmit = async (datas: any) => {
    const response: any = await login(datas, navigate);
    // console.log("d", data.response);
    console.log(response.data);
    const { success, message } = response.data;

    if (success) {
      console.log("success", message);
    } else {
      console.log("error", message);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onsubmit)}>
      {/* {auth} */}
      {/* {count}
      <button onClick={inc}>plus</button> */}
      <Topic message={auth.login.name} />
      <div>
        <Link to="/register">{auth.register.name}</Link>
      </div>
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
      <Button text={auth.login.button} type="submit" />
    </Form>
  );
};

export default Login;
