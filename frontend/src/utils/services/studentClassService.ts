import {
  API_createStudentClass, API_deleteStudentClass,
  API_getAllStudentClasses,
  API_getStudentClassById, API_getStudentClassesByName,
  API_updateStudentClass
} from "../API/API_studentClass";
import {IStudentClass} from "../API/interface";

export class StudentClassService {
  static async getAllStudentClass() {
    const response = await API_getAllStudentClasses()
    const resData: Array<IStudentClass> = response.data
    return resData
  }

  static async getStudentClassById(id: string | number) {
    const response = await API_getStudentClassById(id)
    const resData: IStudentClass = response.data
    return resData
  }

  static async getStudentClassByName(name: string) {
    const response = await API_getStudentClassesByName(name)
    const resData: Array<IStudentClass> = response.data
    return resData
  }

  static async createStudentClass(name: string) {
    const response = await API_createStudentClass(name)
    const resData: IStudentClass = response.data
    return resData
  }

  static async updateStudentClass(id: string | number, name: string) {
    const response = await API_updateStudentClass(id, name)
    const resData: IStudentClass = response.data
    return resData
  }

  static async deleteStudentClass(classId: string | number) {
    const response = await API_deleteStudentClass(classId)
    const resData: IStudentClass = response.data
    return resData
  }
}
