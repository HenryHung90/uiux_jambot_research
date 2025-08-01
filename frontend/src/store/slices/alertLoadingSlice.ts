import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAlertLoadingState {
  alert: {
    isOpen: boolean;
    title: string;
    message: string;
  };
  loading: {
    isOpen: boolean;
  };
}

const initialState: IAlertLoadingState = {
  alert: {
    isOpen: false,
    title: '',
    message: '',
  },
  loading: {
    isOpen: false,
  },
};

const alertLoadingSlice = createSlice({
  name: 'alertLoading',
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<{ title: string; message: string }>) => {
      state.alert.isOpen = true;
      state.alert.title = action.payload.title;
      state.alert.message = action.payload.message;
    },
    closeAlert: (state) => {
      state.alert.isOpen = false;
      state.alert.title = '';
      state.alert.message = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.isOpen = action.payload;
    },
  },
});

export const { setAlert, closeAlert, setLoading } = alertLoadingSlice.actions;
export default alertLoadingSlice.reducer;