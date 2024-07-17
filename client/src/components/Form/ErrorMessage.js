import { jsx as _jsx } from "react/jsx-runtime";
const ErrorMessage = ({ message }) => {
    return _jsx("div", { className: "text-xs text-red-500", children: message });
};
export default ErrorMessage;
