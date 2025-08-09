import {API_POST, API_GET, API_PUT, API_DELETE} from './config'
import {Req_createAndUpdateCourse} from "./interface";

/**
 * 獲取所有課程列表
 * @returns Promise 返回課程列表
 */
export const API_getAllCourses = () => {
  return new API_GET(import.meta.env.VITE_APP_API_COURSES).sendRequest()
}

/**
 * 獲取特定課程的詳細信息
 * @param courseId 課程ID
 * @returns Promise 返回課程詳細信息
 */
export const API_getCourseById = (courseId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_COURSES}${courseId}/`).sendRequest()
}

/**
 * 創建新課程
 * @param courseData 課程數據
 * @returns Promise 返回創建結果
 */
export const API_createCourse = (courseData: Req_createAndUpdateCourse) => {
  return new API_POST(import.meta.env.VITE_APP_API_COURSES, courseData).sendRequest()
}


/**
 * 刪除課程
 * @param courseId 課程ID
 * @returns Promise 返回刪除結果
 */
export const API_deleteCourse = (courseId: string | number) => {
  return new API_DELETE(`${import.meta.env.VITE_APP_API_COURSES}${courseId}/`).sendRequest()
}

/**
 * 切換課程的啟用狀態
 * @param courseId 課程ID
 * @returns Promise 返回課程資料
 */
export const API_toggleCourseActive = (courseId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_COURSES}${courseId}/toggle_active/`).sendRequest()
}

/**
 * 根據班級ID獲取課程列表
 * @param classId 班級ID
 * @returns Promise 返回特定班級的課程列表
 */
export const API_getCoursesByClass = (classId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_COURSES}?student_class=${classId}`).sendRequest()
}

/**
 * 獲取活躍/非活躍課程列表
 * @param isActive 是否活躍
 * @returns Promise 返回活躍/非活躍課程列表
 */
export const API_getCoursesByActiveStatus = (isActive: boolean) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_COURSES}?is_active=${isActive}`).sendRequest()
}

/**
 * 根據名稱獲取課程列表
 * @param name 課程名稱
 * @returns Promise 返回類似名稱課程列表
 */
export const API_getCoursesByName = (name: string) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_COURSES}?name=${name}`).sendRequest()
}

/**
 * 上傳課程內容檔案或設定內容連結
 * @param courseId 課程ID
 * @param data 可以包含檔案或URL的物件
 * @param data.file 課程內容檔案 (可選)
 * @param data.contentUrl 課程內容連結 (可選)
 * @returns Promise 返回上傳結果
 */
export const API_updateCourseContent = (
  courseId: string | number,
  data: Req_createAndUpdateCourse
) => {
  const formData = new FormData();
  if (data.file) {
    formData.append('contents', data.file);
  }
  if (data.content_url) {
    formData.append('content_url', data.content_url);
  }

  return new API_PUT(`${import.meta.env.VITE_APP_API_COURSES}${courseId}/update_content/`, formData).sendRequest();
};


/**
 * 獲取特定課程的所有課程任務
 * @param courseId 課程ID
 * @returns Promise 返回課程任務列表
 */
export const API_getCourseTasks = (courseId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_COURSES}${courseId}/course_tasks/`).sendRequest();
};
