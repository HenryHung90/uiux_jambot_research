import {API_POST, API_GET, API_PUT, API_DELETE} from './config'
import {Req_createAndUpdateCourseTask} from "./interface";

/**
 * 獲取所有課程任務列表
 * @returns Promise 返回課程任務列表
 */
export const API_getAllCourseTasks = () => {
  return new API_GET(import.meta.env.VITE_APP_API_COURSE_TASKS).sendRequest()
}

/**
 * 獲取特定課程任務的詳細信息
 * @param taskId 課程任務ID
 * @returns Promise 返回課程任務詳細信息
 */
export const API_getCourseTaskById = (taskId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_COURSE_TASKS}${taskId}/`).sendRequest()
}

/**
 * 創建新課程任務
 * @param taskData 課程任務數據
 * @returns Promise 返回創建結果
 */
export const API_createCourseTask = (taskData: Req_createAndUpdateCourseTask) => {
  return new API_POST(import.meta.env.VITE_APP_API_COURSE_TASKS, taskData).sendRequest()
}

/**
 * 更新課程任務信息
 * @param taskId 課程任務ID
 * @param taskData 課程任務更新數據
 * @returns Promise 返回更新結果
 */
export const API_updateCourseTask = (taskId: string | number, taskData: Req_createAndUpdateCourseTask) => {
  return new API_PUT(`${import.meta.env.VITE_APP_API_COURSE_TASKS}${taskId}/`, taskData).sendRequest()
}

/**
 * 刪除課程任務
 * @param taskId 課程任務ID
 * @returns Promise 返回刪除結果
 */
export const API_deleteCourseTask = (taskId: string | number) => {
  return new API_DELETE(`${import.meta.env.VITE_APP_API_COURSE_TASKS}${taskId}/`).sendRequest()
}
