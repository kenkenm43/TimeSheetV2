/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Topic from "../../components/Form/Topic";
import { auth } from "../../i18n/auth.json";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/Form/Button";
import { validateLogin } from "../../helpers/validate";

const login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateLogin),
  });

  const onsubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onsubmit)}>
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

export default login;
