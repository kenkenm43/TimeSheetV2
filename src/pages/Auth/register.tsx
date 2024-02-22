/* eslint-disable react-hooks/rules-of-hooks */
import { ChangeEvent, useState } from "react";
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
// interface Form {
//   username: object;
//   password: object;
//   confirmPassword: object;
//   firstName: object;
//   lastName: object;
//   idCard: object;
// }

const login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [idCard, setIdCard] = useState<string>("");
  return (
    <div className="max-w-5xl min-w-96 bg-yellow-300 mx-auto  flex justify-center items-center h-5/6">
      <Form>
        <div className="bg-orange-400 text-white font-bold w-full flex justify-center">
          สมัครสมาชิก
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
        <button className="bg-orange-400 text-white font-bold w-full flex justify-center">
          สมัคร
        </button>
      </Form>
    </div>
  );
};

export default login;
