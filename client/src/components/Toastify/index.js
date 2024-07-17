import { jsx as _jsx } from "react/jsx-runtime";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const index = () => {
    return (_jsx("div", { children: _jsx(ToastContainer, { position: "bottom-left" }) }));
};
export default index;
