import React, {useState, useEffect} from 'react';
import {IStudentCourseTask} from '../../../utils/API/interface';
import {StudentCourseTaskService} from '../../../utils/services/studentCourseTaskService';
import {useAlertLoading} from '../../../store/hooks/useAlertLoading';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
  IconButton
} from "@material-tailwind/react";

interface StudentCourseTaskProps {
  open: boolean;
  onClose: () => void;
  task: IStudentCourseTask;
  onTaskUpdated: () => void;
}

const StudentCourseTaskComponent: React.FC<StudentCourseTaskProps> = ({
                                                                        open,
                                                                        onClose,
                                                                        task,
                                                                        onTaskUpdated
                                                                      }) => {
  const {setAlertLog, setLoadingOpen} = useAlertLoading();
  const [taskFile, setTaskFile] = useState<File | null>(null);
  const [taskLink, setTaskLink] = useState<string>(task.task_link || '');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (taskFile && taskFile.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(taskFile);
      setPreviewUrl(fileUrl);
      return () => {
        URL.revokeObjectURL(fileUrl);
      };
    }
  }, [taskFile]);

  useEffect(() => {
    if (task.task_file && !previewUrl) {
      const absoluteUrl = import.meta.env.VITE_APP_BASENAME + task.task_file;
      setPreviewUrl(absoluteUrl);
    }
  }, [task.task_file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setAlertLog("錯誤", "請上傳圖片格式的文件");
        return;
      }

      setTaskFile(file);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskLink(e.target.value);
  };
  const handleSubmit = async () => {
    if (!taskFile && !taskLink) {
      alert("失敗, 請上傳圖片或連結");
      return;
    }

    try {
      setLoadingOpen(true);
      const formData = new FormData();
      if (taskFile) {
        formData.append('task_file', taskFile);
      }
      if (taskLink) {
        formData.append('task_link', taskLink);
      }
      if (task.student_detail) {
        formData.append('student', task.student_detail.toString());
      } else {
        alert("失敗, 未取得學生資訊");
        return
      }

      if (task.course_detail) {
        formData.append('course', task.course_detail.toString());
      } else {
        alert("失敗, 未取得課程資訊");
        return
      }

      if (task.course_task_detail) {
        formData.append('course_task', task.course_task_detail.toString());
      } else {
        alert("失敗, 未取得作業資訊");
        return
      }

      try {
        // 調用 API 提交作業
        await StudentCourseTaskService.updateStudentCourseTask(task.id, formData);
      } catch {
        alert("失敗, 請再試一次");
      }
      // 提交成功後調用回調函數
      setAlertLog("成功", "作業提交成功");

      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('提交作業失敗:', error);
      setAlertLog("錯誤", "提交作業失敗，請重試");
    } finally {
      setLoadingOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      className="max-h-[90vh] overflow-y-auto"
      placeholder={undefined}
    >
      <DialogHeader className="flex justify-between items-center" placeholder={undefined}>
        <Typography variant="h5" color="blue-gray" placeholder={undefined}>
          {task.course_task_detail.name}
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={onClose}
          placeholder={undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </IconButton>
      </DialogHeader>

      <DialogBody className="p-6" placeholder={undefined}>
        {/* 教材內容部分 */}
        <div className="mb-6">
          <Typography variant="h6" color="blue-gray" className="mb-3" placeholder={undefined}>
            教材內容
          </Typography>
          <div className="bg-gray-50 p-4 rounded-md">
            {task.course_task_detail.contents && (
              <div className="mb-4">
                <Typography className="whitespace-pre-wrap" placeholder={undefined}>
                  {task.course_task_detail.contents['content'] || '無教材內容'}
                </Typography>
              </div>
            )}

            {task.course_task_detail.content_url && (
              <div className="mt-3">
                <a
                  href={task.course_task_detail.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  教材連結
                </a>
              </div>
            )}

            {task.course_task_detail.content_file && (
              <div className="mt-3">
                <a
                  href={task.course_task_detail.content_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  下載教材檔案
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 作業提交部分 */}
        <div className="mb-6">
          <Typography variant="h6" color="blue-gray" className="mb-3" placeholder={undefined}>
            作業提交
          </Typography>
          <div className="space-y-4">
            <div>
              <Typography variant="small" className="mb-1" placeholder={undefined}>
                上傳作業截圖
              </Typography>
              <div className="flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="task-file-input"
                  accept="image/*"
                />
                <label
                  htmlFor="task-file-input"
                  className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  選擇截圖
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {taskFile ? taskFile.name : task.task_file ? '已上傳截圖' : '未選擇截圖'}
                </span>
              </div>

              {previewUrl && (
                <div className="mt-4 border rounded-md p-2">
                  <Typography variant="small" className="mb-2 text-gray-600" placeholder={undefined}>
                    截圖預覽:
                  </Typography>
                  <div className="flex justify-center">
                    <img
                      src={previewUrl}
                      alt="作業截圖預覽"
                      className="max-w-full max-h-[300px] object-contain rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 連結輸入 */}
            <div>
              <Input
                type="text"
                label="作業連結"
                id="task-link"
                value={taskLink}
                onChange={handleLinkChange}
                placeholder="https://example.com/your-work"
                className="mt-1"
                crossOrigin={undefined}
              />
            </div>
          </div>
        </div>

        {task.teacher_mark && Object.keys(task.teacher_mark).length > 0 && (
          <div className="mb-6">
            <Typography variant="h6" color="blue-gray" className="mb-3" placeholder={undefined}>
              教師評語
            </Typography>
            <div className="bg-yellow-50 p-4 rounded-md">
              <Typography className="whitespace-pre-wrap" placeholder={undefined}>
                {typeof task.teacher_mark === 'object'
                  ? JSON.stringify(task.teacher_mark, null, 2)
                  : task.teacher_mark}
              </Typography>
            </div>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="flex justify-end space-x-3" placeholder={undefined}>
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          placeholder={undefined}
        >
          取消
        </Button>
        <Button
          variant="filled"
          color="blue"
          onClick={handleSubmit}
          placeholder={undefined}
        >
          提交作業
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default StudentCourseTaskComponent;
