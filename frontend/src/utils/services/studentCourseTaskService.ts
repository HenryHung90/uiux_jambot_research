import {
  API_createStudentCourseTask,
  API_deleteStudentCourseTask,
  API_getAllStudentCourseTasks,
  API_getStudentCourseTaskById,
  API_getStudentCourseTasksByCourseTask,
  API_getStudentCourseTasksByStudent,
  API_submitMark,
  API_updateStudentCourseTask
} from "../API/API_studentCourseTask";
import {
  IStudentCourseTask,
  Req_submitMark,
  Req_createAndUpdateStudentCourseTask
} from "../API/interface";

export class StudentCourseTaskService {
  static async getAllStudentCourseTasks() {
    const response = await API_getAllStudentCourseTasks()
    const resData: Array<IStudentCourseTask> = response.data
    return resData
  }

  static async getStudentCourseTaskById(taskId: string | number) {
    const response = await API_getStudentCourseTaskById(taskId)
    const resData: IStudentCourseTask = response.data
    return resData
  }

  static async createStudentCourseTask(reqData: Req_createAndUpdateStudentCourseTask) {
    const response = await API_createStudentCourseTask(reqData)
    const resData: IStudentCourseTask = response.data
    return resData
  }

  static async updateStudentCourseTask(taskId: string | number, reqData: Req_createAndUpdateStudentCourseTask) {
    const response = await API_updateStudentCourseTask(taskId, reqData)
    const resData: IStudentCourseTask = response.data
    return resData
  }

  static async deleteStudentCourseTask(taskId: string | number) {
    const response = await API_deleteStudentCourseTask(taskId)
    const resData: IStudentCourseTask = response.data
    return resData
  }

  static async getStudentCourseTasksByStudent(studentId: string | number) {
    const response = await API_getStudentCourseTasksByStudent(studentId)
    const resData: Array<IStudentCourseTask> = response.data
    return resData
  }

  static async getStudentCourseTasksByCourseTask(courseTaskId: string | number) {
    const response = await API_getStudentCourseTasksByCourseTask(courseTaskId)
    const resData: Array<IStudentCourseTask> = response.data
    return resData
  }

  static async submitMark(taskId: string | number, reqData: Req_submitMark) {
    const response = await API_submitMark(taskId, reqData)
    const resData: IStudentCourseTask = response.data
    return resData
  }
}
