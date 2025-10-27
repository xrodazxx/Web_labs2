import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Event, CreateEventData } from '../../types/event';
import { listEvents, createEvent, updateEvent, deleteEvent, listUserEvents, joinEvent, getEventParticipants } from '../../api/eventService';
import type { EventParticipant } from '../../types/eventParticipant';

interface EventState {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: EventState = {
  events: [],
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await listEvents();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки событий');
    }
  }
);

export const fetchUserEvents = createAsyncThunk(
  'events/fetchUserEvents',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await listUserEvents(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки событий');
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      const response = await createEvent(eventData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания события');
    }
  }
);

export const editEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }: { id: string; eventData: Partial<CreateEventData> }, { rejectWithValue }) => {
    try {
      const response = await updateEvent(id, eventData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления события');
    }
  }
);

export const removeEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления события');
    }
  }
);


export const participateInEvent = createAsyncThunk(
  'events/joinEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await joinEvent(eventId);
      return { eventId, participant: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка участия');
    }
  }
);

export const fetchParticipants = createAsyncThunk(
  'events/fetchParticipants',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await getEventParticipants(eventId);
      return { eventId, participants: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки участников');
    }
  }
);


const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetError: (state) => {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(fetchUserEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(addEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events.push(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(editEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(editEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(removeEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = state.events.filter(event => event.id !== action.payload);
      })
      .addCase(removeEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(participateInEvent.fulfilled, (state, action) => {
      const { eventId, participant } = action.payload;
      const event = state.events.find(ev => ev.id === eventId);
      if (event) {
        if (!event.participants) event.participants = [];
        event.participants.push(participant);
      }
    })
    .addCase(fetchParticipants.fulfilled, (state, action) => {
      const { eventId, participants } = action.payload;
      const event = state.events.find(ev => ev.id === eventId);
      if (event) {
        event.participants = participants;
      }
    });
  },
});

export const { resetError } = eventSlice.actions;
export default eventSlice.reducer;