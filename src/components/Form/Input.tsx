import { ChangeEventHandler } from "react";

interface Input {
  type: string;
  text: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Input = ({ type, text, value, onChange }: Input) => {
  return (
    <input
      className="w-72 p-1 px-3 rounded-md border border-gray-300"
      type={type}
      placeholder={text}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
