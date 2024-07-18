/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Topic from "../../components/Form/Topic";
import i18n from "../../i18n/auth.json";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Form/Button";
import { validateLogin } from "../../helpers/validate";
import { login } from "../../services/authServices";
import useAuth from "../../hooks/useAuth";
import useEmployeeStore from "../../context/EmployeeProvider";
import { getEmployee } from "../../services/employeeServices";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
const Login = () => {
  // console.log(auth.username);
  const { setAuth }: any = useAuth();
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

  const onsubmit = async (datas: any) => {
    setIsLoading(true);
    const response: any = await login(datas);
    // console.log("d", data.response);
    const { success, username, message, accessToken, role, employeeId } =
      response.data;
    console.log(response);

    if (success) {
      setAuth({
        id: uuidv4(),
        username: username,
        employeeId: employeeId,
        accessToken: accessToken,
        role: role,
      });

      const employeeData: any = await getEmployee(employeeId);
      console.log(employeeData.data);

      setEmployee({ ...employeeData.data });

      toast.success(message);
      const navigation = (await role?.name) === "admin" ? "/employee" : "/";
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
      <div>
        <Link to="/register">{i18n.auth.register.name}</Link>
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
      <Button text={i18n.auth.login.button} type="submit" />
    </Form>
  );
};

export default Login;
