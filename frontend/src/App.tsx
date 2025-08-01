// style
// API
// components
// interface

import {useRoutes} from "react-router-dom";
import React, {useState, useEffect} from "react";

import {Provider} from 'react-redux';
import store from './store/index';
import {useAlertLoading} from "./store/hooks/useAlertLoading";
import {useUserInfo} from "./store/hooks/useUserInfo";


// style
// API
import {AuthServices} from "./utils/services/core";
// components
import AlertLog from "./components/alertLogAndLoadingPage/AlertLog";
import Loading from "./components/alertLogAndLoadingPage/Loading";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AdminHome from "./pages/AdminHome/AdminHome";
import NotFound from "./pages/errorPage/404/NotFound";
// interface

const AppContent = () => {
  const [routes, setRoutes] = useState<Array<{ path: string; element: JSX.Element }>>([]);
  const {
    alertOpen,
    alertTitle,
    alertMessage,
    loadingOpen,
    handleAlertClose
  } = useAlertLoading();

  const {setUserInfo, isTeacher} = useUserInfo()

  // 檢查登入
  useEffect(() => {
    const fetchUserInfo = async () => {
      const {student_id, name, is_teacher} = await AuthServices.getUserInfo()
      if (student_id) {
        setUserInfo({studentId: student_id, name: name, isTeacher: is_teacher})
      }
    }

    fetchUserInfo()
  }, []);

  useEffect(() => {
    if (isTeacher === null) {
      setRoutes(unauth_routes)
    } else if (isTeacher) {
      setRoutes([...auth_routes, ...teacher_routes])
    } else {
      setRoutes(auth_routes)
    }
  }, [isTeacher]);


  const unauth_routes = [
    {
      path: '*',
      element: <Login/>
    },
  ]

  const auth_routes = [
    {
      path: '/home',
      element: <Home/>
    },
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '*',
      element: <NotFound/>
    }
  ]
  const teacher_routes = [
    {
      path: '/admin',
      element: <AdminHome/>
    },
  ]

  return (
    <div>
      {useRoutes(routes)}
      <Loading loadingOpen={loadingOpen}/>
      <AlertLog
        AlertOpen={alertOpen}
        AlertTitle={alertTitle}
        AlertMsg={alertMessage}
        AlertLogClose={handleAlertClose}
      />
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent/>
    </Provider>
  );
}