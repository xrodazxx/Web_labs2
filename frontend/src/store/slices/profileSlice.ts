import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types/user';
import { getCurrentUser, logout } from '../../api/profileService';

interface ProfileState {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: ProfileState = {
  user: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'profile/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки профиля');
    }
  }
);

// export const logoutUser = createAsyncThunk(
//   'profile/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await logout();
//       return null;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Ошибка выхода');
//     }
//   }
// );

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetError: (state) => {
      state.isError = false;
      state.errorMessage = null;
    },
    clearProfile: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      // .addCase(logoutUser.fulfilled, (state) => {
      //   state.user = null;
      // })
      // .addCase(logoutUser.rejected, (state, action) => {
      //   state.isError = true;
      //   state.errorMessage = action.payload as string;
      // });
  },
});

export const { resetError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;