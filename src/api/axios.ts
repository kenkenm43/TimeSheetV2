import axios from "axios";

const POST = import.meta.env.VITE_API_PORT;
const BASE_URL = `http://localhost:${POST}/api/v1`;

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
