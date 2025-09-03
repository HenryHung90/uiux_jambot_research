import { API_GET } from './config'
import {Req_syncStudentCourses} from "./interface";

interface SyncStudentCoursesParams {
  studentId?: string;
  classId?: number;
}

export const API_syncStudentCourses = (props: SyncStudentCoursesParams) => {
  const {studentId, classId} = props
  const reqData: Req_syncStudentCourses = {
    student_id: studentId,
    class_id: classId,
  }
  return new API_GET('api/sync-student-courses').sendRequest()
}
