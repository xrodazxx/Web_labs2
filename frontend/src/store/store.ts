import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventSlice';
import profileReducer from './slices/profileSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    profile: profileReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;