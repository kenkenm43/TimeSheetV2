import axios from "axios";

// const accessToken = localStorage.getItem("accessToken");
// const refreshToken = localStorage.getItem("refreshToken");

const POST = import.meta.env.VITE_API_PORT;
const BASE_URL = `http://localhost:${POST}/api/v1`;
const VITE_PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
// axios.defaults.baseURL = `http://localhost:${POST}/api/v1`;

export default axios.create({
  baseURL: VITE_PRODUCTION_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: VITE_PRODUCTION_URL + "/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
