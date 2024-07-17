import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import Input from "../../components/Form/Input";
import Form from "../../components/Form/Layout";
import Button from "../../components/Form/Button";
import Topic from "../../components/Form/Topic";
import i18n from "../../i18n/auth.json";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateRegister } from "../../helpers/validate";
import { handleRegister } from "../../services/authServices";
import useAuth from "../../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import useEmployeeStore from "../../context/EmployeeProvider";
import { getEmployee } from "../../services/employeeServices";
import { toast } from "react-toastify";
const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(validateRegister),
    });
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const { employee, setEmployee } = useEmployeeStore();
    const onsubmit = async (data) => {
        const response = await handleRegister(data, navigate);
        const { success, message, username, accessToken, role, employeeId } = response.data;
        if (response.status === 400) {
            toast.error(message);
        }
        if (success) {
            setAuth({
                id: uuidv4(),
                username: username,
                employeeId: employeeId,
                accessToken: accessToken,
                role: role,
            });
            const employeeData = await getEmployee(employeeId);
            console.log(employeeData);
            setEmployee({ ...employeeData.data });
            toast.success(message);
            const navigation = (await role?.name) === "admin" ? "/employee" : "/";
            await navigate(navigation, {
                replace: true,
                state: { employeeId: employeeData.data.id },
            });
            navigate(0);
        }
    };
    return (_jsxs(Form, { onSubmit: handleSubmit(onsubmit), children: [_jsx(Topic, { message: i18n.auth.register.name }), _jsx("div", { children: _jsx(Link, { to: "/login", children: i18n.auth.login.name }) }), _jsx(Input, { register: register("username"), type: "text", errors: errors.username, text: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" }), _jsx(Input, { register: register("firstName"), type: "text", errors: errors.firstName, text: "\u0E0A\u0E37\u0E48\u0E2D\u0E08\u0E23\u0E34\u0E07" }), _jsx(Input, { register: register("lastName"), type: "text", errors: errors.lastName, text: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25" }), _jsx(Input, { register: register("idCard"), type: "text", errors: errors.idCard, text: "\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19" }), _jsx(Input, { register: register("password"), type: "password", errors: errors.password, text: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19" }), _jsx(Input, { register: register("confirmPassword"), type: "password", errors: errors.confirmPassword, text: "\u0E22\u0E37\u0E19\u0E19\u0E22\u0E31\u0E19\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19" }), _jsx(Button, { text: i18n.auth.register.button, type: "submit" })] }));
};
export default RegisterPage;
