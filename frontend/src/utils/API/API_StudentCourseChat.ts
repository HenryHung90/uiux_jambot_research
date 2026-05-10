import {API_POST, API_GET, API_PUT, API_DELETE} from './config'
import Cookies from 'universal-cookie'
import axios from 'axios'
import {Req_chatWithAIData, Req_getStudentCourseChatByPagination} from "./interface";


export const API_getStudentCourseChats = (paginationData: Req_getStudentCourseChatByPagination) => {
  return new API_POST(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_CHATS}get_by_pagination/`, paginationData).sendRequest()
}

export const API_chatWithAI = (chatData: Req_chatWithAIData) => {
  return new API_POST(`${import.meta.env.VITE_APP_API_STUDENT_COURSE_CHATS}chat_with_ai/`, chatData).sendRequest()
}

export const API_getAllStudentCourseChatsByCourseId = (courseData: Req_chatWithAIData) => {
  const cookies = new Cookies()
  return axios.post(
    `${import.meta.env.VITE_APP_API_STUDENT_COURSE_CHATS}get_all_student_chats_by_course_id/`,
    courseData,
    {
      responseType: 'blob',
      withCredentials: true,
      headers: {
        "X-CSRFToken": cookies.get("csrftoken")
      }
    }
  )
}
