import {
  API_chatWithAI,
  API_getAllStudentCourseChatsByCourseId,
  API_getStudentCourseChats
} from "../API/API_StudentCourseChat";
import {IStudentCourseChat, Req_chatWithAIData, Req_getStudentCourseChatByPagination} from "../API/interface";

export class StudentCourseChatService {
  static async getStudentCourseChatsByPagination(course_id: string, page: number, pageSize: number) {
    const paginationData:Req_getStudentCourseChatByPagination = {
      course_id: course_id,
      page: page,
      page_size: pageSize
    }
    const response = await API_getStudentCourseChats(paginationData)
    const resData: Array<IStudentCourseChat> = response.data.results
    return resData
  }

  static async sendMessage(course_id: string, content: string) {
    const chatData: Req_chatWithAIData = {
      course_id: course_id,
      chat_content: content
    }
    const response = await API_chatWithAI(chatData)
    const resData: IStudentCourseChat = response.data
    return resData
  }

  static async getAllChatsByCourseId(course_id: string | number) {
    const chatData: Req_chatWithAIData = {
      course_id: course_id,
    }
    const response = await API_getAllStudentCourseChatsByCourseId(chatData)
    return response.data
  }

  static downloadExcel(blob: Blob, filename: string = 'course_chats.xlsx') {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
