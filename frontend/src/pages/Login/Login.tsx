import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
// style
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@material-tailwind/react";
// API
import {AuthServices} from "../../utils/services/core";
import {useAlertLoading} from "../../store/hooks/useAlertLoading";
// components
import ImageComponent from "../../components/Image/Image";
import {useUserInfo} from "../../store/hooks/useUserInfo";
// interface


const Login = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {setAlertLog, setLoadingOpen} = useAlertLoading();
  const {setUserInfo} = useUserInfo()
  const NavLocation = useNavigate()

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin(e); // 直接調用登入函數
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingOpen(true);
      const {student_id, name, is_teacher, student_class_id} = await AuthServices.login({student_id: studentId, password: password})
      if (student_id) {
        setUserInfo({studentId: student_id, name: name, isTeacher: is_teacher, studentClassId: student_class_id})
        NavLocation(is_teacher ? '/admin' : '/')
      }
    } catch (error) {
      setAlertLog("登入失敗", "請檢查您的帳號密碼是否正確");
    } finally {
      setLoadingOpen(false)
    }
  };

  return (
    <div className='flex justify-center items-center w-[100vw] h-[100vh] animate-fadeIn'>
      <Card className='w-96' placeholder={undefined}>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-36 place-items-center"
          placeholder={undefined}>
          <ImageComponent
            src={`${import.meta.env.VITE_APP_TEST_DNS}/${import.meta.env.VITE_APP_FILES_ROUTE}/img/logo.PNG`} alt='logo'
            width='70px' height='50px'/>
          <p className='text-xl '>UIUX</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 animate-loginSlideIn delay-700" placeholder={undefined}
                  onKeyDown={handleKeyUp}>
          <Input label="StudentId" id='acc' size="lg" type="text" value={studentId} onChange={e => {
            setStudentId(e.target.value)
          }} crossOrigin={undefined}/>
          <Input label="Password" id='psw' size="lg" type="password" value={password} onChange={e => {
            setPassword(e.target.value)
          }} crossOrigin={undefined}/>
          <Button variant="gradient" id='login' fullWidth className='mt-4 animate-loginSlideIn delay-1000'
                  onClick={handleLogin}
                  placeholder={undefined}
          >
            Log In
          </Button>
        </CardBody>
        <CardFooter className="text-center text-[0.6rem] text-stamindTask-black-850" placeholder={undefined}>
          <p>all right reserved</p>
          <p>Copyright© Henry.H</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
