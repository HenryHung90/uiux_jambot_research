import {
  API_createCourse,
  API_deleteCourse,
  API_getAllCourses,
  API_getCourseById, API_getCoursesByActiveStatus, API_getCoursesByClass, API_getCoursesByName, API_toggleCourseActive,
  API_updateCourse, API_updateCourseContent
} from "../API/API_course";
import {ICourseStudent, ICourseTeacher, Req_createCourse, Req_updateCourse} from "../API/interface";

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

  static async createCourse(reqData: Req_createCourse) {
    const response = await API_createCourse(reqData)
    const resData: ICourseTeacher = response.data
    return resData
  }

  static async updateCourse(courseId: string | number, reqData: Req_updateCourse) {
    const response = await API_updateCourse(courseId, reqData)
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

  static async updateCourseContent(courseId: string | number, reqData: Req_updateCourse) {
    const response = await API_updateCourseContent(courseId, reqData)
    const resData: ICourseTeacher = response.data
    return resData
  }
}
