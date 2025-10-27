import baseApi from "./baseInstance";
import { setUser, getUser, removeUser, getToken,removeToken } from "../utils/localStorage";

export const getCurrentUser = async () => {
  const user = getUser();
  const token =getToken();

  if (!token) {
    return null;
  }

  if (!user) {
    const response = await baseApi.get("/api/profile/getCurrentUser");
    setUser(response.data);
  }

  return getUser();
};


export const logout = async() =>{
    removeUser();
    removeToken();
}