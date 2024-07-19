/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Button from "../../components/Form/Button";
import Topic from "../../components/Form/Topic";
import i18n from "../../i18n/auth.json";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateRegister } from "../../helpers/validate";
import { handleRegister } from "../../services/authServices";
import useAuth from "../../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import useEmployeeStore from "../../context/EmployeeProvider";
import { getEmployee } from "../../services/employeeServices";
import { toast } from "react-toastify";
import { useState } from "react";
import Loading from "../../components/Loading";
import Save from "../../components/Loading/save";
const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateRegister),
  });
  const { setAuth }: any = useAuth();
  const navigate = useNavigate();
  const { employee, setEmployee }: any = useEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const onsubmit = async (data: any) => {
    setIsLoading(true);
    const response: any = await handleRegister(data, navigate);
    const { success, message, username, accessToken, role, employeeId } =
      response.data;

    if (response.status === 400) {
      toast.error(message);
    }

    if (success) {
      setAuth({
        id: uuidv4(),
        username: username,
        employeeId: employeeId,
        accessToken: accessToken,
        role: role,
      });
      const employeeData: any = await getEmployee(employeeId);
      console.log(employeeData);

      setEmployee({ ...employeeData.data });

      toast.success(message);
      setIsLoading(false);
      const navigation = (await role?.name) === "admin" ? "/employee" : "/";
      await navigate(navigation, {
        replace: true,
        state: { employeeId: employeeData.data.id },
      });
      navigate(0);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onsubmit)}>
      {isLoading && <Save />}
      <Topic message={i18n.auth.register.name} />
      <div>
        <Link to="/login">{i18n.auth.login.name}</Link>
      </div>
      <Input
        register={register("username")}
        type="text"
        errors={errors.username}
        text="ชื่อผู้ใช้งาน"
      />
      <Input
        register={register("firstName")}
        type="text"
        errors={errors.firstName}
        text="ชื่อจริง"
      />
      <Input
        register={register("lastName")}
        type="text"
        errors={errors.lastName}
        text="นามสกุล"
      />
      <Input
        register={register("idCard")}
        type="text"
        errors={errors.idCard}
        text="เลขบัตรประชาชน"
      />
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
        text="ยืนนยันรหัสผ่าน"
      />
      <Button text={i18n.auth.register.button} type={"submit"} />
    </Form>
  );
};
export default RegisterPage;
