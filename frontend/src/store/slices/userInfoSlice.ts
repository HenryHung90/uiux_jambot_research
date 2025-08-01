import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserInfoState {
  studentId: string;
  name: string;
  isTeacher: boolean;
}

const initialState: IUserInfoState = {
  studentId: '',
  name: '',
  isTeacher: null,
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<IUserInfoState>) {
      state.studentId = action.payload.studentId;
      state.name = action.payload.name;
      state.isTeacher = action.payload.isTeacher;
    },
    setUserEmpty(state) {
      state.studentId = '';
      state.name = '';
      state.isTeacher = false;
    }
  },
})

export const { setUserInfo, setUserEmpty } = userInfoSlice.actions;
export default userInfoSlice.reducer;