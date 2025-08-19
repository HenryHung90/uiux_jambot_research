import {API_POST, API_GET, API_PUT, API_DELETE} from './config'
import {Req_changePassword, Req_createStudent, Req_updateStudent, Req_adminChangePassword} from "./interface";


/**
 * 獲取所有學生列表
 * @returns Promise 返回學生列表
 */
export const API_getAllStudents = () => {
  return new API_GET(import.meta.env.VITE_APP_API_STUDENTS).sendRequest()
}

/**
 * 獲取特定學生的詳細信息
 * @param studentId 學生ID
 * @returns Promise 返回學生詳細信息
 */
export const API_getStudentById = (studentId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENTS}${studentId}/`).sendRequest()
}

/**
 * 創建新學生
 * @param studentData 學生數據
 * @returns Promise 返回創建結果
 */
export const API_createStudent = (studentData: Req_createStudent) => {
  return new API_POST(import.meta.env.VITE_APP_API_STUDENTS, studentData).sendRequest()
}

/**
 * 更新學生信息
 * @param studentId 學生ID
 * @param studentData 學生更新數據
 * @returns Promise 返回更新結果
 */
export const API_updateStudent = (studentId: string | number, studentData: Req_updateStudent) => {
  return new API_PUT(`${import.meta.env.VITE_APP_API_STUDENTS}${studentId}/`, studentData).sendRequest()
}

/**
 * 刪除學生
 * @param studentId 學生ID
 * @returns Promise 返回刪除結果
 */
export const API_deleteStudent = (studentId: string | number) => {
  return new API_DELETE(`${import.meta.env.VITE_APP_API_STUDENTS}${studentId}/`).sendRequest()
}

/**
 * 修改學生密碼 (需要舊密碼驗證)
 * @param studentId 學生ID
 * @param passwordData 密碼數據 (包含舊密碼和新密碼)
 * @returns Promise 返回密碼修改結果
 */
export const API_changeStudentPassword = (studentId: string | number, passwordData: Req_changePassword) => {
  return new API_POST(`${import.meta.env.VITE_APP_API_STUDENTS}${studentId}/change_password/`, passwordData).sendRequest()
}

/**
 * 管理員直接修改學生密碼 (不需要舊密碼驗證)
 * @param studentId 學生ID
 * @param passwordData 密碼數據 (只需要新密碼)
 * @returns Promise 返回密碼修改結果
 */
export const API_adminChangeStudentPassword = (studentId: string | number, passwordData: Req_adminChangePassword) => {
  return new API_POST(`${import.meta.env.VITE_APP_API_STUDENTS}${studentId}/change_password_admin/`, passwordData).sendRequest()
}

/**
 * 批量導入學生
 * @returns Promise 返回導入結果
 * @param file
 */
export const API_bulkImportStudents = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return new API_POST(`${import.meta.env.VITE_APP_API_STUDENTS}bulk_import/`, formData).sendRequest()
}

/**
 * 下載學生批量導入範本
 * @returns 下載Excel範本文件
 */
export const API_downloadStudentTemplate = () => {
  window.open(`${import.meta.env.VITE_APP_API_STUDENTS}download_template/`, '_blank');
}

/**
 * 根據班級ID獲取學生列表
 * @param classId 班級ID
 * @returns Promise 返回特定班級的學生列表
 */
export const API_getStudentsByClass = (classId: string | number) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENTS}?student_class=${classId}`).sendRequest()
}

/**
 * 根據學生姓名搜索學生
 * @param name 學生姓名
 * @returns Promise 返回符合搜索條件的學生列表
 */
export const API_searchStudentsByName = (name: string) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENTS}?name=${encodeURIComponent(name)}`).sendRequest()
}

/**
 * 獲取活躍/非活躍學生列表
 * @param isActive 是否活躍
 * @returns Promise 返回活躍/非活躍學生列表
 */
export const API_getStudentsByActiveStatus = (isActive: boolean) => {
  return new API_GET(`${import.meta.env.VITE_APP_API_STUDENTS}?is_active=${isActive}`).sendRequest()
}

/**
 * 設定學生的 active
 * @param studentId 學生ID
 * @returns Promise 學生資料
 */
export const API_toggleStudentActive = (studentId: string | number) => {
  return new API_POST(`${import.meta.env.VITE_APP_API_STUDENTS}${studentId}/toggle_active/`, {}).sendRequest()
}
