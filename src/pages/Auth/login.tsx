/* eslint-disable react-hooks/rules-of-hooks */
import { ChangeEvent, useState } from "react";
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Button from "../../components/Form/Button";
import Topic from "../../components/Form/Topic";
const login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <Form>
      <Topic message="ลงชื่อเข้าใช้" />
      <Input
        type="text"
        text="ชื่อผู้ใช้งาน"
        value={username}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
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
      <Button text="เข้าสู่ระบบ" />
    </Form>
  );
};

export default login;
