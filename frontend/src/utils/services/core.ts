import {Res_login, Req_login} from "../API/interface";
import {API_Login, API_logout, API_getUserInfo} from "../API/API_core";

export class AuthServices {
  static async login(reqData: Req_login) {
    const response = await API_Login(reqData.student_id, reqData.password)
    const resData: Res_login = response.data
    return resData
  }

  static async logout() {
    const response = await API_logout()
    window.location.href = '/'
  }

  static async getUserInfo() {
    return await API_getUserInfo()
  }
}