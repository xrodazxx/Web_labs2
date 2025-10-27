import type {User} from "./user"
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  participants?: User[];
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  location: string;
}