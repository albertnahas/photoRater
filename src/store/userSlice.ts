/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = { a: '' }

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: any, action: PayloadAction<any>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions

export default userSlice.reducer
