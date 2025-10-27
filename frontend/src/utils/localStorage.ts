import type { User } from "../types/user";

export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};
  
export const removeToken = () => {
    localStorage.removeItem('token');
};

export const setUser = (user: User | null): void => {
  if (user === null) {
    localStorage.removeItem("user");
    return;
  }
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): User | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const removeUser = async() =>{
  localStorage.removeItem("user");
}