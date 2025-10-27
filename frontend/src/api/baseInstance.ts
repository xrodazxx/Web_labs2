import axios from "axios";
import {getToken} from "../utils/localStorage.ts"

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

baseApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default baseApi;
