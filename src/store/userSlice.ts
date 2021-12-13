/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/state';
import { User } from '../types/user';

const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
    setServerUser: (state: UserState, action: PayloadAction<any>) => {
      state.serverValue = action.payload;
    },
    removeUser: (state: UserState) => {
      state.value = null;
      state.serverValue = null;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setUser, setServerUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
