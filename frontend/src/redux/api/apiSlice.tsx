import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface APIState {
  initialCredentialCheck: boolean,
  initialCredentialCheckLoading: boolean
}

const initialState: APIState = {
  initialCredentialCheck: false,
  initialCredentialCheckLoading: false
};

export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setInitialCredentialCheck: (state, action: PayloadAction<boolean>) => {
      console.log("setting initial credential check");
      state.initialCredentialCheck = action.payload;
    },
    setInitialCredentialCheckLoading: (state, action: PayloadAction<boolean>) => {
      console.log("setting initial credential check loading");
      state.initialCredentialCheck = action.payload;
    },
  },
});

/* Exports */
// Actions
export const { 
  setInitialCredentialCheck,
  setInitialCredentialCheckLoading
 } = apiSlice.actions;

// Reducers
export default apiSlice.reducer;
