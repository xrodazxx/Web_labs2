export interface EventParticipant {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}