import {API_syncStudentCourses} from '../API/API_admin';

export class AdminService {
  /**
   * 同步學生課程和課程任務
   * @returns 同步結果
   */
  static async syncStudentCourses() {
    const response = await API_syncStudentCourses()
    return response.data;
  }
}
