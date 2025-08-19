import {
  API_bulkImportStudents,
  API_changeStudentPassword,
  API_adminChangeStudentPassword,
  API_createStudent,
  API_deleteStudent,
  API_downloadStudentTemplate,
  API_getAllStudents,
  API_getStudentById,
  API_getStudentsByActiveStatus,
  API_getStudentsByClass,
  API_searchStudentsByName,
  API_toggleStudentActive,
  API_updateStudent
} from "../API/API_student";
import {IStudent, Req_adminChangePassword, Req_changePassword, Req_createStudent, Req_updateStudent, RequestParams} from "../API/interface";

// 定義批量導入學生的返回結果接口
interface BulkImportResult {
  message: string;
  details?: {
    success: number;
    failed: number;
    errors?: Array<{
      row: number;
      student_id: string;
      error: string;
    }>;
  };
}

export class StudentService {
  static async getAllStudents() {
    const response = await API_getAllStudents()
    const resData: Array<IStudent> = response.data
    return resData
  }

  static async getStudentById(studentId: string | number) {
    const response = await API_getStudentById(studentId)
    const resData: IStudent = response.data
    return resData
  }

  static async createStudent(reqData: Req_createStudent) {
    const response = await API_createStudent(reqData)
    const resData: IStudent = response.data
    return resData
  }

  static async updateStudent(studentId: string | number, reqData: Req_updateStudent) {
    const response = await API_updateStudent(studentId, reqData)
    const resData: IStudent = response.data
    return resData
  }

  static async deleteStudent(studentId: string | number) {
    const response = await API_deleteStudent(studentId)
    const resData: IStudent = response.data
    return resData
  }

  static async changeStudentPassword(studentId: string | number, reqData: Req_changePassword) {
    const response = await API_changeStudentPassword(studentId, reqData)
    const resData = response.data
    return resData
  }

  static async adminChangeStudentPassword(studentId: string | number, reqData: Req_adminChangePassword) {
    const response = await API_adminChangeStudentPassword(studentId, reqData)
    const resData = response.data
    return resData
  }

  static async uploadStudents(file: File): Promise<BulkImportResult> {
    const response = await API_bulkImportStudents(file)
    return response.data
  }

  static downloadStudentTemplate() {
    API_downloadStudentTemplate()
  }

  static async getStudentsByClass(classId: string | number) {
    const response = await API_getStudentsByClass(classId)
    const resData: Array<IStudent> = response.data
    return resData
  }

  static async getStudentByName(name: string) {
    const response = await API_searchStudentsByName(name)
    const resData: IStudent = response.data
    return resData
  }
  static async getStudentsByActiveStatus(isActive: boolean) {
    const response = await API_getStudentsByActiveStatus(isActive)
    const resData: Array<IStudent> = response.data
    return resData
  }

  static async toggleStudentActive(studentId: string | number) {
    const response = await API_toggleStudentActive(studentId)
    const resData: IStudent = response.data
    return resData
  }
}
