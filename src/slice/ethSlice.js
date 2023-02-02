import { createSlice } from '@reduxjs/toolkit'

export const ethSlice = createSlice({
  name: 'eth',
  initialState: {
    balance: 0,
    account: null,
  },
  reducers: {
    set: (state, action) => {
      state = {...state,...action.payload}
    },
    logout: (state) =>{
        state = {balance: 0, account: null}
    }
  },
})

// Action creators are generated for each case reducer function
export const { set,logout } = ethSlice.actions

export default ethSlice.reducer