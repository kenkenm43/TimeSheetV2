import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Users = () => {
    const [users, setUsers] = useState([{ username: "" }]);
    const axiosPrivate = useAxiosPrivate();
    const refresh = useRefreshToken();
    const navigate = useNavigate();
    const location = useLocation();
    // const { authy, setAuth }: any = useAuthStore();
    const { auth, setAuth } = useAuth();
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const fetchUsers = async () => {
            try {
                const response = await axiosPrivate.get("/users", {
                    signal: controller.signal,
                });
                isMounted && setUsers(response.data);
            }
            catch (error) {
                console.log(error);
                navigate("/login", { state: { from: location }, replace: true });
            }
        };
        fetchUsers();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);
    return (_jsxs("div", { children: [_jsx("h2", { children: "Users list" }), users?.length, " ?", " ", _jsx("ul", { children: users.map((user, i) => (_jsx("li", { children: user?.username }, i))) }), " ", ":", " ", _jsx("div", { children: _jsx("p", { children: "No users to display" }) }), auth && _jsx("div", { children: auth.username }), _jsx("button", { onClick: () => setAuth({ username: "sdawda", accessToken: "dawdad" }), children: "ChangeState" }), _jsx("button", { onClick: () => refresh(), children: "Refresh" })] }));
};
export default Users;
