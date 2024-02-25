import axios from "axios";
import { handleRefreshToken } from "./authServices";

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

const POST = process.env.API_PORT;
axios.defaults.baseURL = `http://localhost:${POST}/api/v1`;

axios.interceptors.request.use(
  function (config) {
    if (accessToken) {
      config.headers["authorization"] = `Bearer ${accessToken}`;
      config.headers["refresh_token"] = refreshToken || "";
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    console.log("success status request", response);
    return response;
  },
  async (error) => {
    //save original request
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url.includes("auth/refresh-token")
    ) {
      //this means refresh token route is being called and refresh tokenb is invalid
      //clear everything and show whatever the message needed
      return Promise.reject(error);
    } else if (error.resposne.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await handleRefreshToken();
      //call refresh token handler
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axios;
