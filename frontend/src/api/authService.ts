import baseApi from "./baseInstance.ts";
import {setToken, setUser, removeToken} from "../utils/localStorage.ts"

export const login = async(email:string, password:string) =>{
    const response= await baseApi.post("/api/auth/login", {email, password});
    setToken(response.data.accessToken)
    return response.data;
}

export const register = async(name:string, email:string, password:string) =>{
    const response= await baseApi.post("/api/auth/register", {name, email, password});
    return response.data;
}