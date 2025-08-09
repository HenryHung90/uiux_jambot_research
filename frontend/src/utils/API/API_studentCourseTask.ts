import {API_POST, API_GET, API_PUT, API_DELETE} from './config'
import {Req_submitMark, Req_createAndUpdateStudentCourseTask} from "./interface";

/**
 * 獲取所有學生課程任務列表
 * @returns Promise 返回學生課程任務列表
 */
export const API_getAllStudentCourseTasks = () => {
  return new API_GET(import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS).sendRequest()
}

/**
 * 獲取特定學生課程任務的詳細信息
 * @param taskId 學生課程任務ID
 * @returns Promise 返回學生課程任務詳細信息
 */
export const API_getStudentCourseTaskById = (taskId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS}${taskId}/`).sendRequest()
}

/**
 * 創建新學生課程任務
 * @param taskData 學生課程任務數據
 * @returns Promise 返回創建結果
 */
export const API_createStudentCourseTask = (taskData: Req_createAndUpdateStudentCourseTask) => {
  return new API_POST(import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS, taskData).sendRequest()
}

/**
 * 更新學生課程任務信息
 * @param taskId 學生課程任務ID
 * @param taskData 學生課程任務更新數據
 * @returns Promise 返回更新結果
 */
export const API_updateStudentCourseTask = (taskId: string | number, taskData: Req_createAndUpdateStudentCourseTask) => {
  return new API_PUT(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS}${taskId}/`, taskData).sendRequest()
}

/**
 * 刪除學生課程任務
 * @param taskId 學生課程任務ID
 * @returns Promise 返回刪除結果
 */
export const API_deleteStudentCourseTask = (taskId: string | number) => {
  return new API_DELETE(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS}${taskId}/`).sendRequest()
}

/**
 * 根據學生ID獲取學生課程任務列表
 * @param studentId 學生ID
 * @returns Promise 返回特定學生的課程任務列表
 */
export const API_getStudentCourseTasksByStudent = (studentId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS}?student=${studentId}`).sendRequest()
}

/**
 * 根據課程任務ID獲取學生課程任務列表
 * @param courseTaskId 課程任務ID
 * @returns Promise 返回特定課程任務的學生提交列表
 */
export const API_getStudentCourseTasksByCourseTask = (courseTaskId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS}?course_task=${courseTaskId}`).sendRequest()
}

/**
 * 教師提交評分
 * @param taskId 學生課程任務ID
 * @param markData 評分數據
 * @returns Promise 返回評分結果
 */
export const API_submitMark = (taskId: string | number, markData: Req_submitMark) => {
  return new API_POST(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_TASKS}${taskId}/submit_mark/`, markData).sendRequest()
}
