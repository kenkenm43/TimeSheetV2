/* eslint-disable react-hooks/rules-of-hooks */
import { ChangeEvent, useState } from "react";
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Button from "../../components/Form/Button";
import Topic from "../../components/Form/Topic";
import { auth } from "../../i18n/auth.json";

const login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [idCard, setIdCard] = useState<string>("");
  return (
    <Form>
      <Topic message={auth.login.name} />
      <Input
        type="text"
        text="ชื่อผู้ใช้งาน"
        value={username}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
      />
      <Input
        type="text"
        text="ชื่อจริง"
        value={firstName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setFirstName(e.target.value)
        }
      />
      <Input
        type="text"
        text="นามสกุล"
        value={lastName}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setLastName(e.target.value)
        }
      />
      <Input
        type="number"
        text="เลขบัตรประชาชน"
        value={idCard}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setIdCard(e.target.value)
        }
      />
      <Input
        type="password"
        text="รหัสผ่าน"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <Input
        type="password"
        text="ยืนยันรหัสผ่าน"
        value={confirmPassword}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setConfirmPassword(e.target.value)
        }
      />
      <Button text={auth.login.button} />
    </Form>
  );
};

export default login;
