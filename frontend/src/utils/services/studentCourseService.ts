import {
    API_createStudentCourse,
    API_deleteStudentCourse,
    API_getAllStudentCourses,
    API_getStudentCourseById,
    API_getStudentCoursesByCourse,
    API_getStudentCoursesByStudent,
    API_getStudentCourseTasks,
    API_updateStudentCourse
} from "../API/API_studentCourse";
import {
    IStudentCourse,
    IStudentCourseTask,
    Req_analyzeStudentCourseTask, Req_checkPatchStatus,
    Req_createAndUpdateStudentCourse
} from "../API/interface";
import {API_checkPatchStatus, API_patchAnalyzeStudentCourseTask} from "../API/API_studentCourseTask";

export class StudentCourseService {
    static async getAllStudentCourses() {
        const response = await API_getAllStudentCourses()
        const resData: Array<IStudentCourse> = response.data
        return resData
    }

    static async getStudentCourseById(studentCourseId: string | number) {
        const response = await API_getStudentCourseById(studentCourseId)
        const resData: IStudentCourse = response.data
        return resData
    }

    static async createStudentCourse(reqData: Req_createAndUpdateStudentCourse) {
        const response = await API_createStudentCourse(reqData)
        const resData: IStudentCourse = response.data
        return resData
    }

    static async updateStudentCourse(studentCourseId: string | number, reqData: Req_createAndUpdateStudentCourse) {
        const response = await API_updateStudentCourse(studentCourseId, reqData)
        const resData: IStudentCourse = response.data
        return resData
    }

    static async deleteStudentCourse(studentCourseId: string | number) {
        const response = await API_deleteStudentCourse(studentCourseId)
        const resData: IStudentCourse = response.data
        return resData
    }

    static async getStudentCoursesByStudent(studentId: string | number) {
        const response = await API_getStudentCoursesByStudent(studentId)
        const resData: Array<IStudentCourse> = response.data
        return resData
    }

    static async getStudentCoursesByCourse(courseId: string | number) {
        const response = await API_getStudentCoursesByCourse(courseId)
        const resData: Array<IStudentCourse> = response.data
        return resData
    }

    static async getStudentCourseTasks(studentCourseId: string | number) {
        const response = await API_getStudentCourseTasks(studentCourseId)
        const resData: Array<IStudentCourseTask> = response.data
        return resData
    }

    static async patchAnalyzeStudentCourseTask(courseId: string | number, courseTaskId: string | number) {
        const response = await API_patchAnalyzeStudentCourseTask(courseId, courseTaskId)
        const resData: Req_analyzeStudentCourseTask = response.data
        return resData
    }

    static async checkPatchAnalyzeStatus(patchId: string) {
        const response = await API_checkPatchStatus(patchId)
        const resData: Req_checkPatchStatus = response.data
        return resData
    }
}
