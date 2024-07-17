import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
const Input = ({ type, text, register, errors }) => {
    const isPassword = type === "password";
    const [isShowPassword, setIsShowPassword] = useState(false);
    const isErrors = errors?.message ? true : false;
    const bordersLine = isErrors
        ? `group-focus-within:!border-red-500 border-red-400 group-hover:border-red-400`
        : `group-focus-within:!border-blue-500 border-gray-400 group-hover:border-gray-700`;
    const textAlert = isErrors
        ? `group-focus-within:!text-red-500 text-red-500`
        : `group-focus-within:!text-blue-500 text-gray-500`;
    return (_jsxs("div", { children: [_jsxs("div", { className: "relative group flex items-center text-xs", children: [_jsx("input", { ...register, type: type === "password" ? (isShowPassword ? "text" : type) : type, className: `outline-none px-3 py-3 peer w-full ${isPassword && "pr-24"} ${isErrors && "bg-red-100"}`, placeholder: " " }), isPassword && (_jsx("span", { onClick: () => setIsShowPassword(!isShowPassword), className: "absolute  right-2  flex items-center cursor-pointer transition-all  duration-500 text-sm", children: _jsx("span", { className: "hover:right-4 text-xs", children: isShowPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน" }) })), _jsx("label", { className: `absolute left-[9px] top-px text-sm  transition-all duration-300 px-1 transform -translate-y-1/2 pointer-events-none 
  peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm group-focus-within:!top-px group-focus-within:!text-sm ${textAlert}`, children: text }), _jsx("fieldset", { className: `inset-0 absolute border border-gray-400 rounded pointer-events-none mt-[-9px] invisible peer-placeholder-shown:visible 
   group-focus-within:border-2 group-hover:border-gray-700
  ${bordersLine}
  `, children: _jsx("legend", { className: `ml-2 px-0 text-sm transition-all duration-300 invisible max-w-[0.01px] group-focus-within:max-w-full group-focus-within:px-1 whitespace-nowrap`, children: text }) }), _jsx("fieldset", { className: `inset-0 absolute border border-gray-400 rounded pointer-events-none mt-[-9px] visible peer-placeholder-shown:invisible 
  group-focus-within:border-2 group-hover:border-gray-700  
  ${bordersLine}`, children: _jsxs("legend", { className: "ml-2 text-sm invisible px-1 max-w-full whitespace-nowrap", children: ["dawd ", text] }) })] }), isErrors && _jsx(ErrorMessage, { message: errors?.message })] }));
};
export default Input;
