import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "../index";
import {IUserInfoState} from "../slices/userInfoSlice";
import {setUserInfo, setUserEmpty} from "../slices/userInfoSlice";

export const useUserInfo = () => {
  const dispatch = useDispatch();
  const userInfoState = useSelector((state: RootState) => state.userInfo);

  return {
    studentId: userInfoState.studentId,
    name: userInfoState.name,
    isTeacher: userInfoState.isTeacher,
    studentClassId: userInfoState.studentClassId,

    setUserInfo: (userInfo: IUserInfoState) => dispatch(setUserInfo(userInfo)),
    clearUserInfo: () => dispatch(setUserEmpty()),
  }
}
