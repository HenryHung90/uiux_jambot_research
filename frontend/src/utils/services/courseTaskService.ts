import {
  API_createCourseTask,
  API_deleteCourseTask,
  API_getAllCourseTasks,
  API_getCourseTaskById,
  API_updateCourseTask
} from "../API/API_courseTask";
import {ICourseTask, Req_createAndUpdateCourseTask} from "../API/interface";

export class CourseTaskService {
  static async getAllCourseTasks() {
    const response = await API_getAllCourseTasks()
    const resData: Array<ICourseTask> = response.data
    return resData
  }

  static async getCourseTaskById(taskId: string | number) {
    const response = await API_getCourseTaskById(taskId)
    const resData: ICourseTask = response.data
    return resData
  }

  static async createCourseTask(reqData: Req_createAndUpdateCourseTask) {
    const response = await API_createCourseTask(reqData)
    const resData: ICourseTask = response.data
    return resData
  }

  static async updateCourseTask(taskId: string | number, reqData: Req_createAndUpdateCourseTask) {
    const response = await API_updateCourseTask(taskId, reqData)
    const resData: ICourseTask = response.data
    return resData
  }

  static async deleteCourseTask(taskId: string | number) {
    const response = await API_deleteCourseTask(taskId)
    const resData: ICourseTask = response.data
    return resData
  }
}
