/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Button from "../../components/Form/Button";
import Topic from "../../components/Form/Topic";
import { auth } from "../../i18n/auth.json";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateRegister } from "../../helpers/validate";

const register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateRegister),
  });

  const onsubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onsubmit)}>
      <Topic message={auth.register.name} />
      <div>
        <Link to="/login">{auth.login.name}</Link>
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
      <Button text={auth.register.button} type={"submit"} />
    </Form>
  );
};

export default register;
