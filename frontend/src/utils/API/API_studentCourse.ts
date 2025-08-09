import {API_POST, API_GET, API_PUT, API_DELETE} from './config'
import {Req_createAndUpdateStudentCourse} from "./interface";

/**
 * 獲取所有學生課程列表
 * @returns Promise 返回學生課程列表
 */
export const API_getAllStudentCourses = () => {
  return new API_GET(import.meta.env.VITE_APP_API_STUDENT_COURSES).sendRequest()
}

/**
 * 獲取特定學生課程的詳細信息
 * @param studentCourseId 學生課程ID
 * @returns Promise 返回學生課程詳細信息
 */
export const API_getStudentCourseById = (studentCourseId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_COURSES}${studentCourseId}/`).sendRequest()
}

/**
 * 創建新學生課程
 * @param studentCourseData 學生課程數據
 * @returns Promise 返回創建結果
 */
export const API_createStudentCourse = (studentCourseData: Req_createAndUpdateStudentCourse) => {
  return new API_POST(import.meta.env.VITE_APP_API_STUDENT_COURSES, studentCourseData).sendRequest()
}

/**
 * 更新學生課程信息
 * @param studentCourseId 學生課程ID
 * @param studentCourseData 學生課程更新數據
 * @returns Promise 返回更新結果
 */
export const API_updateStudentCourse = (studentCourseId: string | number, studentCourseData: Req_createAndUpdateStudentCourse) => {
  return new API_PUT(`${import.meta.env.VITE_APP_API_STUDENT_COURSES}${studentCourseId}/`, studentCourseData).sendRequest()
}

/**
 * 刪除學生課程
 * @param studentCourseId 學生課程ID
 * @returns Promise 返回刪除結果
 */
export const API_deleteStudentCourse = (studentCourseId: string | number) => {
  return new API_DELETE(`${import.meta.env.VITE_APP_API_STUDENT_COURSES}${studentCourseId}/`).sendRequest()
}

/**
 * 根據學生ID獲取學生課程列表
 * @param studentId 學生ID
 * @returns Promise 返回特定學生的課程列表
 */
export const API_getStudentCoursesByStudent = (studentId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_COURSES}?student=${studentId}`).sendRequest()
}

/**
 * 根據課程ID獲取學生課程列表
 * @param courseId 課程ID
 * @returns Promise 返回特定課程的學生列表
 */
export const API_getStudentCoursesByCourse = (courseId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_COURSES}?course=${courseId}`).sendRequest()
}

/**
 * 獲取特定學生課程的所有學生課程任務
 * @param studentCourseId 學生課程ID
 * @returns Promise 返回學生課程任務列表
 */
export const API_getStudentCourseTasks = (studentCourseId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_COURSES}${studentCourseId}/student_course_tasks/`).sendRequest()
}
