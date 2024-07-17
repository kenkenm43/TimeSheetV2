import { jwtDecode } from "jwt-decode";

type AccessTokenType = {
  username: string;
  isLoggedIn: boolean;
  id: string;
};

const useAuth = (): boolean => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;
  if (accessToken) {
    const decoded = jwtDecode(accessToken) as AccessTokenType;
    if (decoded.isLoggedIn) return true;
  }
  return false;
};
