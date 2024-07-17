import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    return (_jsxs("section", { children: [_jsx("h1", { children: "Unauthorized" }), _jsx("br", {}), _jsx("p", { children: "You do not have access to the requested page." }), _jsx("div", { className: "flexGrow", children: _jsx("button", { onClick: goBack, children: "Go Back" }) })] }));
};
export default Unauthorized;
