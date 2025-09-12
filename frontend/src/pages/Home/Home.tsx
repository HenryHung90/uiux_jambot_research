import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
// Service imports
import {StudentCourseService} from "../../utils/services/studentCourseService";

// Interface imports
import {IStudentCourse, IStudentCourseTask} from "../../utils/API/interface";

// Redux imports
import {useDispatch} from "react-redux";
import {useUserInfo} from "../../store/hooks/useUserInfo";
import PasswordChangeComponent from "./components/PasswordChange";
import StudentCourseTaskDialog from "./components/StudentCourse";
import {AuthServices} from "../../utils/services/core";


const Home = () => {
  const {studentId, name, isTeacher, studentClassId} = useUserInfo();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [studentCourses, setStudentCourses] = useState<IStudentCourse[]>([]);
  const [studentCourseTasks, setStudentCourseTasks] = useState<{[courseId: number]: IStudentCourseTask[]}>({});

  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<IStudentCourseTask | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState<boolean>(false);

  useEffect(() => {
    if (isTeacher) {
      navigate("/admin");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const courses = await StudentCourseService.getStudentCoursesByStudent(studentId);
        setStudentCourses(courses)

        const tasksMap: {[courseId: number]: IStudentCourseTask[]} = {};
        await Promise.all(
          courses.map(async (course) => {
            try {
              const tasks = await StudentCourseService.getStudentCourseTasks(course.id);
              if (course && course.id) {
                tasksMap[course.id] = tasks;
              }
            } catch (error) {
              if (course && course.id) {
                tasksMap[course.id] = [];
              }
            }
          })
        );

        setStudentCourseTasks(tasksMap);
      } catch (error) {
        console.error("獲取數據失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, studentClassId, isTeacher, navigate, dispatch]);

  const handleTaskClick = (task: IStudentCourseTask) => {
    setSelectedTask(task);
    setShowTaskDialog(true);
  };

  const handleTaskUpdated = async () => {
    try {
      setLoading(true);

      const courses = await StudentCourseService.getStudentCoursesByStudent(studentId);
      setStudentCourses(courses);

      const tasksMap: {[courseId: number]: IStudentCourseTask[]} = {};
      await Promise.all(
        courses.map(async (course) => {
          try {
            const tasks = await StudentCourseService.getStudentCourseTasks(course.id);
            if (course && course.id) {
              tasksMap[course.id] = tasks;
            }
          } catch (error) {
            if (course && course.id) {
              tasksMap[course.id] = [];
            }
          }
        })
      );

      setStudentCourseTasks(tasksMap);
    } catch (error) {
      console.error("刷新数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthServices.logout()
    navigate("/");
  };

  const handleChangePassword = () => {
    setShowPasswordDialog(true);
  };

  const closePasswordDialog = () => {
    setShowPasswordDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 頂部學生信息和按鈕 */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-gray-600">學號: {studentId}</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={handleChangePassword}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            修改密碼
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            登出
          </button>
        </div>
      </div>

      {/* 學期單元和作業列表 */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">我的課程與作業</h2>
        {loading ? (
          <p className="text-gray-500">加載中...</p>
        ) : studentCourses.length === 0 ? (
          <p className="text-gray-500">暫無課程</p>
        ) : (
          <div className="space-y-6">
            {studentCourses.map((course) => (
              <div key={course.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-lg font-medium mb-2">{course.course_detail.name}</h3>
                {studentCourseTasks[course.id]?.length > 0 ? (
                  <div className="space-y-2">
                    {studentCourseTasks[course.id].map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{task.course_task_detail.name}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(task.created_at || '').toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.task_file || task.task_link 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.task_file || task.task_link ? '已提交' : '未提交'}
                          </span>
                          {task.teacher_mark && Object.keys(task.teacher_mark).length > 0 && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              已評分
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">暫無作業</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showPasswordDialog && (
        <PasswordChangeComponent open={showPasswordDialog} onClose={closePasswordDialog}/>
      )}
      {showTaskDialog && selectedTask && (
        <StudentCourseTaskDialog
          open={showTaskDialog}
          onClose={() => setShowTaskDialog(false)}
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
};

export default Home;
