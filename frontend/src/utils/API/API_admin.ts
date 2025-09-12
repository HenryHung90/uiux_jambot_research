import { API_GET } from './config'


export const API_syncStudentCourses = () => {
  return new API_GET(import.meta.env.VITE_APP_API_SYNC_STUDENT_COURSES).sendRequest()
}
