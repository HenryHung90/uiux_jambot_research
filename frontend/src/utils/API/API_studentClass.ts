import {API_POST, API_GET, API_PUT, API_DELETE} from './config'
import {IStudentClass, Req_createStudentClass, Req_updateStudentClass} from "./interface";

/**
 * 獲取所有班級列表
 * @returns Promise 返回班級列表
 */
export const API_getAllStudentClasses = () => {
  return new API_GET(import.meta.env.VITE_APP_API_STUDENT_CLASSES).sendRequest()
}

/**
 * 獲取特定班級的詳細信息
 * @param classId 班級ID
 * @returns Promise 返回班級詳細信息
 */
export const API_getStudentClassById = (classId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_CLASSES}${classId}/`).sendRequest()
}

/**
 * 通過班級名稱查詢班級
 * @param name 班級名稱
 * @returns Promise 返回符合名稱的班級列表
 */
export const API_getStudentClassesByName = (name: string) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENT_CLASSES}?name=${encodeURIComponent(name)}`).sendRequest()
}

/**
 * 創建新班級
 * @param name 班級名稱
 * @returns Promise 返回創建結果
 */
export const API_createStudentClass = (name: string) => {
  const reqData: Req_createStudentClass = {
    name: name
  }
  return new API_POST(import.meta.env.VITE_APP_API_STUDENT_CLASSES, reqData).sendRequest()
}

/**
 * 更新班級信息
 * @param classId 班級ID
 * @param name 班級名稱
 * @returns Promise 返回更新結果
 */
export const API_updateStudentClass = (classId: string | number, name: string) => {
  const reqData: Req_updateStudentClass = {
    name: name
  }
  return new API_PUT(`${import.meta.env.VITE_APP_API_STUDENT_CLASSES}${classId}/`, reqData).sendRequest()
}

/**
 * 刪除班級
 * @param classId 班級ID
 * @returns Promise 返回刪除結果
 */
export const API_deleteStudentClass = (classId: string | number) => {
  return new API_DELETE(`${import.meta.env.VITE_APP_API_STUDENT_CLASSES}${classId}/`).sendRequest()
}
