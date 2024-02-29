/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "../services/httpClient";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth }: any = useAuth();

  const refresh = async () => {
    const response = await httpClient.get("/auth/refresh-tokenV2", {
      withCredentials: true,
    });

    setAuth({ accessToken: response.data.accessToken });

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
