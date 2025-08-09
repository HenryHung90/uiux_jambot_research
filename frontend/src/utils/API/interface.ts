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

export interface IStudentClass {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICourseStudent {
  id: number;
  name: string;
  student_id: string;
  contents: string;
  content_url: string;
}

export interface ICourseTeacher extends ICourseStudent {
  all_assistive_tool_analysis: any
  all_prompt_analysis: any
}

export interface IStudent {
  student_id: string;
  name: string;
  student_class: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ICourseTask {
  id: number;
  name: string;
  student_class_detail: IStudentClass
  course_detail: ICourseTeacher
  contents: JSON
  all_assistive_tool_analysis: any
  all_prompt_analysis: any
  created_at?: string;
  updated_at?: string;
}

export interface IStudentCourse {
  id: number;
  student: IStudent;
  course: ICourseTeacher;
  created_at?: string;
  updated_at?: string;
}

export interface IStudentCourseTask {
  id: number;
  student: IStudent;
  course_task: ICourseTask;
  status: string;
  submission: any;
  score?: number;
  feedback?: string;
  created_at?: string;
  updated_at?: string;
}

//--------------------------------------------------------
// API Request Extension
export interface Req_login extends RequestParams {
  student_id: string
  password: string
}

export interface Req_createStudentClass extends RequestParams {
  name: string;
}

export interface Req_updateStudentClass extends RequestParams {
  name: string;
}

export interface Req_changePassword extends RequestParams {
  old_password: string;
  new_password: string;
}

export interface Req_createStudent extends RequestParams {
  student_id: string;
  name: string;
  password: string;
  student_class: number;
  is_active?: boolean;
}

export interface Req_updateStudent extends RequestParams {
  name?: string;
  student_class?: number;
  is_active?: boolean;
}

export interface Req_createAndUpdateCourse extends RequestParams {
  name?: string;
  student_class?: number;
  is_active?: boolean;
  content_url?: string;
  file?: File;
}

export interface Req_createAndUpdateCourseTask extends RequestParams {
  name?: string;
  student_class?: number;
  course?: number;
  contents?: JSON;
  all_assistive_tool_analysis?: JSON;
  all_prompt_analysis?: JSON;
}

export interface Req_createAndUpdateStudentCourse extends RequestParams {
  student?: number;
  course?: number;
}

export interface Req_createAndUpdateStudentCourseTask extends RequestParams {
  student?: number;
  course_task?: number;
  status?: string;
  submission?: any;
  score?: number;
  feedback?: string;
}

export interface Req_submitMark extends RequestParams {
  teacher_mark: any;
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
