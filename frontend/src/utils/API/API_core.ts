import {API_POST, API_GET} from './config'
import {Req_login} from "./interface"

export const API_Login = (acc: string, psw: string) => {
  const loginData: Req_login = {
    message: 'login request',
    student_id: acc,
    password: psw,
  }
  return new API_POST(import.meta.env.VITE_APP_API_LOGIN || '', loginData).sendLogin()
}

export const API_logout = () => {
  return new API_GET(import.meta.env.VITE_APP_API_LOGOUT || '').sendRequest()
}

export const API_getUserInfo = () => {
  return new API_GET(import.meta.env.VITE_APP_API_USERINFO || '').sendRequest_sessionAndUserinfo()
}