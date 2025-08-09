import {
  API_bulkImportStudents,
  API_changeStudentPassword,
  API_createStudent,
  API_deleteStudent,
  API_getAllStudents,
  API_getStudentById,
  API_getStudentsByActiveStatus,
  API_getStudentsByClass,
  API_searchStudentsByName,
  API_toggleStudentActive,
  API_updateStudent
} from "../API/API_student";
import {IStudent, Req_changePassword, Req_createStudent, Req_updateStudent, RequestParams} from "../API/interface";


export class StudentService {
  static async getAllStudents() {
    const response = await API_getAllStudents()
    const resData: Array<IStudent> = response.data
    return resData
  }

  static async getStudentById(studentId: string | number) {
    const response = await API_getStudentById(studentId)
    const resData: IStudent = response.data
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
    const resData: IStudent = response.data
    return resData
  }

  static async uploadStudents(file: File){
    const response = await API_bulkImportStudents(file)
    const resData: RequestParams = response.data
    return resData
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
