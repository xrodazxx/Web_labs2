import baseApi from "./baseInstance";
import {getToken, setToken, removeToken} from "../utils/localStorage.ts"
import type {User} from "../types/user.ts";

export const listEvents= async () =>{
    const response=await baseApi.get("/api/events");
    return response.data;
}

export const listUserEvents = async (id: string) =>{
    const response=await baseApi.get(`/api/events/user/${id}`);
    return response.data;
}

export const createEvent = async (eventData: any) =>{
    const response =await baseApi.post("/api/events", eventData);
    return response.data;
}

export const updateEvent = async(id:string, eventData: any) =>{
    const response = await baseApi.put(`/api/events/${id}`, eventData);
    return response.data;
}

export const deleteEvent = async(id:string) =>{
    const response = await baseApi.delete(`/api/events/${id}`);
    return response.data
}

export const joinEvent = async (eventId: string) => {
  const response = await baseApi.post(`/api/events/${eventId}/participate`);
  return response.data;
};

export const getEventParticipants = async (eventId: string) => {
  const response = await baseApi.get(`/api/events/${eventId}/participants`);
  return response.data as User[];
};