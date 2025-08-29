//creator slice


import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreatorState {
  id: string | null;
  name: string;
  email: string;
}

const initialState: CreatorState = {
  id: localStorage.getItem("creatorId"), 
  name: '',
  email: '',
};





const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    setCreator: (state, action: PayloadAction<CreatorState>) => { 
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;

      localStorage.setItem("creatorId", action.payload.id || '');
      localStorage.setItem("creatorName", action.payload.name || '');
      localStorage.setItem("creatorEmail", action.payload.email || '');
    },
    clearCreator: (state) => {
      state.id = null;
      state.name = '';
      state.email = '';

      localStorage.removeItem("creatorId");
      localStorage.removeItem("creatorName");
      localStorage.removeItem("creatorEmail");
    },
  },
});

export const { setCreator, clearCreator } = creatorSlice.actions;

export default creatorSlice.reducer;
