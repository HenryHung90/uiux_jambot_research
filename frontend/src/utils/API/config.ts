import Cookies from "universal-cookie"
import axios, {AxiosError} from "axios"
import {CSRF_cookies, RequestParams, ResponseData} from "./interface"

class APIController {
  // API Loc
  protected baseURL: string;
  protected method: string;
  protected data: RequestParams | undefined | FormData
  protected cookies: Cookies
  protected TEST_MODE: boolean

  constructor(baseURL: string, method: string, data: RequestParams | undefined | FormData) {
    this.baseURL = baseURL
    this.method = method
    this.data = data
    this.cookies = new Cookies()
    this.TEST_MODE = true
  }

  // 發送請求
  public async sendRequest() {
    // axios request
    return await axios({
      method: this.method,
      url: this.baseURL,
      withCredentials: this.TEST_MODE,
      ...(this.method.toUpperCase() === 'POST' || this.method.toUpperCase() === 'PUT'
        ? {data: this.data}
        : {params: this.data}),
      headers: {
        "X-CSRFToken": this.cookies.get("csrftoken")
      }
    }).then((response) => {
      const resData: ResponseData = {
        message: response.data.message,
        data: response.data,
        status: response.status
      }
      return resData
    }).catch((error: AxiosError) => {
      return this.handleError(error)
    })
  }

  // 處理錯誤
  protected handleError(error: AxiosError) {
    if (error.response) {
      const data = error.response?.data as { message: string; status: number }
      // 回應錯誤
      console.error("Error Response:", data.message || error.message)
      alert(data.message || error.message)
    } else if (error.request) {
      // Server 無響應
      console.error("Error Request:", error.request)
      alert("請求超時，請再試一次")
    } else {
      // 其他错误
      console.error("Error Message:", error.message)
    }
    const data = error.response?.data as { message: string; status: number }
    const resData: CSRF_cookies = {
      message: data.message || error.message,
      status: error.response ? error.response.status : 500,
      is_teacher: false,
      data: JSON,
      name: 'nobody',
      student_id: '',
      student_class_id: ''
    }
    return resData
  }
}

export class API_POST extends APIController {
  constructor(baseURL: string, data: RequestParams | FormData) {
    super(baseURL, "POST", data)
  }

  public async sendLogin() {
    // axios request
    return await axios({
      method: this.method,
      url: this.baseURL,
      withCredentials: this.TEST_MODE,
      data: this.data,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.cookies.get("csrftoken")
      }
    }).then((response) => {
      return {
        data: response.data,
        status: response.status
      }
    }).catch((error: AxiosError) => {
      return this.handleError(error)
    })
  }
}

export class API_GET extends APIController {
  constructor(baseURL: string, params?: RequestParams | FormData) {
    super(baseURL, "GET", params)
  }

  public async sendRequest_sessionAndUserinfo() {
    return await axios({
      method: this.method,
      url: this.baseURL,
      withCredentials: this.TEST_MODE,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.cookies.get("csrftoken")
      }
    }).then((response: {
      status: number,
      data: { is_teacher: any; name: string; student_id: string, student_class_id: string }
    }) => {
      const resData: CSRF_cookies = {
        message: "",
        status: response.status,
        is_teacher: response.data.is_teacher,
        name: response.data.name || '',
        student_id: response.data.student_id || '',
        student_class_id: response.data.student_class_id || '',
        data: JSON
      }
      return resData
    }).catch((error: AxiosError) => {
      return this.handleError(error)
    })
  }
}

export class API_PUT extends APIController {
  constructor(baseURL: string, params?: RequestParams | FormData) {
    super(baseURL, "PUT", params)
  }
}


export class API_DELETE extends APIController {
  constructor(baseURL: string, params?: RequestParams | FormData) {
    super(baseURL, "DELETE", params)
  }
}
