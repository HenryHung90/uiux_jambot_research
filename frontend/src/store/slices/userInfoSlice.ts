import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserInfoState {
  studentId: string;
  name: string;
  isTeacher: boolean;
  studentClassId: string;
}

const initialState: IUserInfoState = {
  studentId: '',
  name: '',
  isTeacher: null,
  studentClassId: ''
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<IUserInfoState>) {
      state.studentId = action.payload.studentId;
      state.name = action.payload.name;
      state.isTeacher = action.payload.isTeacher;
      state.studentClassId = action.payload.studentClassId;
    },
    setUserEmpty(state) {
      state.studentId = '';
      state.name = '';
      state.isTeacher = false;
       state.studentClassId = '';
    }
  },
})

export const { setUserInfo, setUserEmpty } = userInfoSlice.actions;
export default userInfoSlice.reducer;
