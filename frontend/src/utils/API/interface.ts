

// Request 訊息內容
export interface RequestParams {
  message?: string
}

// Response 訊息內容
export interface ResponseData {
  message: string
  data: any
  status: number
}
//--------------------------------------------------------
// API Request Extension
export interface Req_login extends RequestParams {
  student_id: string
  password: string
}

//--------------------------------------------------------
// API Response Extension
// csrf cookie Response
export interface CSRF_cookies extends ResponseData {
  is_teacher: boolean
  name: string
  student_id: string
}

export interface Res_login extends ResponseData {
  name: string
  is_teacher: boolean
  student_id: string
  status: number
}