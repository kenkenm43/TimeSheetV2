/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ChangeEventHandler, useState } from "react";

interface Input {
  type?: string;
  name?: string;
  inputRef?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  text?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  register?: any;
  errors?: any;
  isErrors?: any;
}

const Input = ({ type, text, register, errors }: Input) => {
  const isPassword = type === "password";
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const isErrors: boolean = errors?.message ? true : false;
  const bordersLine: string = isErrors
    ? `group-focus-within:!border-red-500 border-red-400 group-hover:border-red-400`
    : `group-focus-within:!border-blue-500 border-gray-400 group-hover:border-gray-700`;
  const textAlert: string = isErrors
    ? `group-focus-within:!text-red-500`
    : `group-focus-within:!text-blue-500`;
  return (
    <div className="relative group flex items-center text-xs">
      <input
        {...register}
        type={type === "password" ? (isShowPassword ? "text" : type) : type}
        className={`outline-none px-3 py-3 peer w-full ${
          isPassword && "pr-24"
        } ${isErrors && "bg-red-100"}`}
        placeholder=" "
      />
      {isPassword && (
        <span
          onClick={() => setIsShowPassword(!isShowPassword)}
          className="absolute  right-2  flex items-center cursor-pointer transition-all  duration-500 text-sm"
        >
          <span className="hover:right-4 text-xs">
            {isShowPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          </span>
        </span>
      )}

      <label
        className={`absolute left-[9px] top-px text-sm text-gray-500 transition-all duration-300 px-1 transform -translate-y-1/2 pointer-events-none 
  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm group-focus-within:!top-px group-focus-within:!text-sm ${textAlert}`}
      >
        {text}
      </label>

      <fieldset
        className={`inset-0 absolute border border-gray-400 rounded pointer-events-none mt-[-9px] invisible peer-placeholder-shown:visible 
   group-focus-within:border-2 group-hover:border-gray-700
  ${bordersLine}
  `}
      >
        <legend
          className={`ml-2 px-0 text-sm transition-all duration-300 invisible max-w-[0.01px] group-focus-within:max-w-full group-focus-within:px-1 whitespace-nowrap`}
        >
          {text}
        </legend>
      </fieldset>

      <fieldset
        className={`inset-0 absolute border border-gray-400 rounded pointer-events-none mt-[-9px] visible peer-placeholder-shown:invisible 
  group-focus-within:border-2 group-hover:border-gray-700  
  ${bordersLine}`}
      >
        <legend className="ml-2 text-sm invisible px-1 max-w-full whitespace-nowrap">
          {text}
        </legend>
      </fieldset>
      {/* {errors && <div>{errors?.message}</div>} */}
    </div>

    // <div className="relative flex items-center text-xs">
    //   <div className="absolute bottom-5">text</div>
    //   <input
    //     className={`w-full p-1 px-3 transition-all duration-700 rounded-md border border-gray-300
    //       focus:hover:border-transparent hover:border-purple-900 focus:outline outline-blue-500 focus:placeholder:text-gray-600 focus:placeholder:text-opacity-20}
    //     ${isPassword && "pr-24"}`}
    //     type={type === "password" ? (isShowPassword ? "text" : type) : type}
    //     placeholder={text}
    //     value={value}
    //     onChange={onChange}
    //   />
    // {isPassword && (
    //   <span
    //     onClick={() => setIsShowPassword(!isShowPassword)}
    //     className="absolute  right-2  flex items-center cursor-pointer transition-all  duration-500 text-sm"
    //   >
    //     <span className="hover:right-4 text-xs">
    //       {isShowPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
    //     </span>
    //   </span>
    // )}
    // </div>
  );
};

export default Input;
