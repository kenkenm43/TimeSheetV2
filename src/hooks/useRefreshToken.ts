/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "../services/httpClient";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const refresh = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setAuth }: any = useAuth();
    const response = await axios.get("/refresh-token", {
      withCredentials: true,
    });
    setAuth((prev: any): any => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
