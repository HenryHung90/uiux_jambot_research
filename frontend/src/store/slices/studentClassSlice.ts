import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StudentClassService } from '../../utils/services/studentClassService';

// 定義類型
interface CourseTask {
  id: number;
  name: string;
  [key: string]: any;
}

interface Course {
  id: number;
  name: string;
  courseTasks: CourseTask[];
  [key: string]: any;
}

interface StudentClass {
  id: number;
  name: string;
  courses: Course[];
  [key: string]: any;
}

// 定義 State 類型
interface StudentClassState {
  studentClasses: StudentClass[];
  loading: boolean;
  error: string | null;
  currentClassId: number | null;
}

// 初始狀態
const initialState: StudentClassState = {
  studentClasses: [],
  loading: false,
  error: null,
  currentClassId: null
};

export const fetchStudentClassesData = createAsyncThunk(
  'studentClass/fetchData',  // action type 前綴
  async (_, { rejectWithValue }) => {  // 異步回調函數
    try {
      const data = await StudentClassService.getCompletelyStudentClassInfo();
      return data;  // 成功時返回數據
    } catch (error) {
      return rejectWithValue((error as Error).message);  // 失敗時返回錯誤訊息
    }
  }
);

const studentClassSlice = createSlice({
  name: 'studentClass',
  initialState,
  reducers: {
    setCurrentClassId: (state, action: PayloadAction<number>) => {
      state.currentClassId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentClassesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentClassesData.fulfilled, (state, action: PayloadAction<StudentClass[]>) => {
        state.loading = false;
        state.studentClasses = action.payload;
        // 如果有班級數據且當前沒有選中的班級，則選中第一個
        if (action.payload.length > 0 && state.currentClassId === null) {
          state.currentClassId = action.payload[0].id;
        }
      })
      .addCase(fetchStudentClassesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// 導出 actions 和 reducer
export const { setCurrentClassId } = studentClassSlice.actions;
export default studentClassSlice.reducer;
