import {
  API_createCourse,
  API_deleteCourse,
  API_getAllCourses,
  API_getCourseById,
  API_getCoursesByActiveStatus,
  API_getCoursesByClass,
  API_getCoursesByName,
  API_getCourseTasks,
  API_toggleCourseActive, API_updateCourse,
} from "../API/API_course";
import {ICourseTask, ICourseTeacher, Req_createAndUpdateCourse} from "../API/interface";

export class CourseService {
  // TODO: 區分 Teacher & Student get Courses
  static async getAllCourses() {
    const response = await API_getAllCourses()
    const resData: Array<ICourseTeacher> = response.data
    return resData
  }

  static async getCourseById(courseId: string | number) {
    const response = await API_getCourseById(courseId)
    const resData: ICourseTeacher = response.data
    return resData
  }

  static async createCourse(reqData: Req_createAndUpdateCourse) {
    const response = await API_createCourse(reqData)
    const resData: ICourseTeacher = response.data
    return resData
  }

  static async deleteCourse(courseId: string | number) {
    const response = await API_deleteCourse(courseId)
    const resData: ICourseTeacher = response.data
    return resData
  }

  static async toggleCourseActive(courseId: string | number) {
    const response = await API_toggleCourseActive(courseId)
    const resData: ICourseTeacher = response.data
    return resData
  }

  static async getCoursesByClassId(classId: string | number) {
    const response = await API_getCoursesByClass(classId)
    const resData: Array<ICourseTeacher> = response.data
    return resData
  }

  static async getCoursesByActiveStatus(isActive: boolean) {
    const response = await API_getCoursesByActiveStatus(isActive)
    const resData: Array<ICourseTeacher> = response.data
    return resData
  }

  static async getCoursesByName(name: string) {
    const response = await API_getCoursesByName(name)
    const resData: Array<ICourseTeacher> = response.data
    return resData
  }

  static async updateCourseContent(courseId: string | number, reqData: Req_createAndUpdateCourse) {
    const response = await API_updateCourse(courseId, reqData)
    const resData: ICourseTeacher = response.data
    return resData
  }

  static async getCourseTasks(courseId: string | number) {
    const response = await API_getCourseTasks(courseId)
    const resData: Array<ICourseTask> = response.data
    return resData
  }
}
