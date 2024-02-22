/* eslint-disable react-hooks/rules-of-hooks */
import { ChangeEvent, useState } from "react";
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
const login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div className="max-w-5xl min-w-96 bg-yellow-300 mx-auto  flex justify-center items-center h-5/6">
      <Form>
        <div className="bg-orange-400 text-white font-bold w-full flex justify-center">
          เข้าสู่ระบบ
        </div>
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

        <button className="bg-orange-400 text-white font-bold w-full flex justify-center">
          เข้าสู่ระบบ
        </button>
      </Form>
    </div>
  );
};

export default login;
