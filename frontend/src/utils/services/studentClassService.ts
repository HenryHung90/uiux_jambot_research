import {
  API_createStudentClass, API_deleteStudentClass,
  API_getAllStudentClasses,
  API_getStudentClassById, API_getStudentClassesByName,
  API_updateStudentClass
} from "../API/API_studentClass";
import {IStudentClass} from "../API/interface";
import {API_getAllCourses} from "../API/API_course";
import {API_getAllCourseTasks} from "../API/API_courseTask";

export class StudentClassService {
  static async getAllStudentClass() {
    const response = await API_getAllStudentClasses()
    const resData: Array<IStudentClass> = response.data
    return resData
  }

  static async getCompletelyStudentClassInfo() {
    const studentClasses = await API_getAllStudentClasses()
    const courses = await API_getAllCourses()
    const courseTasks = await API_getAllCourseTasks()

    const completelyData = []

    for (const studentClass of studentClasses.data) {
      const classRelatedCourses = courses.data.filter(course => course.student_class === studentClass.id);

      const coursesWithTasks = classRelatedCourses.map(course => {
        const courseRelatedTasks = courseTasks.data.filter(task => task.course_detail.id === course.id);
        return {
          ...course,
          courseTasks: courseRelatedTasks
        };
      });
      completelyData.push({
        ...studentClass,
        courses: coursesWithTasks
      });
    }
    return completelyData
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
