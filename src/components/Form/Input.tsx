import { ChangeEventHandler, useState } from "react";

interface Input {
  type: string;
  text: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Input = ({ type, text, value, onChange }: Input) => {
  const isPassword = type === "password";
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  console.log("daw", isPassword);

  return (
    <div className="relative flex items-center">
      <input
        className={`w-full p-1 px-3 transition-all duration-300 rounded-md border border-gray-300
        focus:outline outline-blue-500 hover:border-blue-400 focus:placeholder:text-black focus:placeholder:text-opacity-65}
        ${isPassword && "pr-24"}`}
        type={type === "password" ? (isShowPassword ? "text" : type) : type}
        placeholder={text}
        value={value}
        onChange={onChange}
      />
      {type === "password" && (
        <span
          onClick={() => setIsShowPassword(!isShowPassword)}
          className="absolute  right-2  flex items-center cursor-pointer transition-all  duration-500 text-sm"
        >
          <span className="hover:right-4">
            {isShowPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          </span>
        </span>
      )}
    </div>
  );
};

export default Input;
