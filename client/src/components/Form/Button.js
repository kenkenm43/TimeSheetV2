import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./Button.module.css";
const Button = ({ text, type = "submit" }) => {
    return (_jsx("button", { type: type, className: `${styles.btnEffect} bg-orange-600 hover:bg-orange-500 transition-all duration-500 hover:opacity-95 py-1`, children: text }));
};
export default Button;
