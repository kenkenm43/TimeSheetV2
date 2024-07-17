import { jwtDecode } from "jwt-decode";
const useAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken)
        return false;
    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (decoded.isLoggedIn)
            return true;
    }
    return false;
};
