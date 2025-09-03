import { API_syncStudentCourses } from '../API/API_admin';

interface SyncParams {
  studentId?: string;
  classId?: number;
}

export class AdminService {
  /**
   * 同步學生課程和課程任務
   * @param params 可選參數：student_id（學生ID）和 class_id（班級ID）
   * @returns 同步結果
   */
  static async syncStudentCourses(params: SyncParams = {}) {
    try {
      const response = await API_syncStudentCourses(params);
      return response.data;
    } catch (error) {
      console.error('同步學生課程失敗:', error);
      throw error;
    }
  }
}
