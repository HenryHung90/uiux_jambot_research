import React, {useState, useEffect} from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  Input
} from "@material-tailwind/react";
import {StudentCourseTaskService} from "../../../utils/services/studentCourseTaskService";
import AnalyticDetailComponent from "../../../components/AnalyticDetail/AnalyticDetail";

interface Student {
  name: string;
  student_id: string;
}

interface StudentSubmission {
  id?: number;
  student: Student;
  task_file?: string;
  task_link?: string;
  created_at?: string;
  course_task?: number;
}

interface SubmissionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  submission: StudentSubmission | null;
  onSubmissionUpdate?: (updatedSubmission: StudentSubmission) => void;
}

const SubmissionDetailComponent: React.FC<SubmissionDetailDialogProps> = ({
  open,
  onClose,
  submission,
  onSubmissionUpdate
}) => {
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localSubmission, setLocalSubmission] = useState<StudentSubmission | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  // 當submission變更時，更新本地狀態
  useEffect(() => {
    setLocalSubmission(submission);
    // 重置分析結果
    setAnalysisResult(null);
  }, [submission]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '尚未繳交';
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 處理截圖上傳
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);

      // 創建預覽URL
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
    }
  };

  // 上傳截圖
  const handleUploadScreenshot = async () => {
    if (!screenshotFile || !localSubmission || !localSubmission.id) {
      console.error('缺少必要的上傳資訊');
      return;
    }

    setIsUploading(true);

    try {
      // 創建FormData對象用於文件上傳
      const formData = new FormData();
      formData.append('task_file', screenshotFile);

      const response = await StudentCourseTaskService.updateStudentCourseTask(
        localSubmission.id,
        formData
      );

      console.log('截圖上傳成功:', response);

      // 更新本地提交數據
      if (response && response.task_file) {
        const updatedSubmission = {
          ...localSubmission,
          task_file: response.task_file
        };

        // 更新本地狀態
        setLocalSubmission(updatedSubmission);

        // 通知父組件更新
        if (onSubmissionUpdate) {
          onSubmissionUpdate(updatedSubmission);
        }
      }

      // 顯示成功訊息
      alert('截圖上傳成功！');

      // 清空上傳狀態
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } catch (error) {
      console.error('上傳截圖失敗:', error);
      alert('上傳失敗，請重試');
    } finally {
      setIsUploading(false);
    }
  };

  // 判斷文件是否為圖片
  const isImageFile = (url: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  // 清除預覽和選擇的文件
  const clearScreenshot = () => {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  // 如果沒有本地提交數據，返回null
  if (!localSubmission) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      placeholder={undefined}
      size="xl"
    >
      <DialogHeader placeholder={undefined}>
        {localSubmission ? `${localSubmission.student.name} 的繳交內容` : '繳交內容'}
      </DialogHeader>
      <DialogBody placeholder={undefined} className="overflow-y-auto max-h-[70vh]">
        {localSubmission ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" className="mb-2" placeholder={undefined}>學生資訊</Typography>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Typography variant="small" className="font-semibold" placeholder={undefined}>學號:</Typography>
                  <Typography variant="paragraph" placeholder={undefined}>{localSubmission.student.student_id}</Typography>
                </div>
                <div>
                  <Typography variant="small" className="font-semibold" placeholder={undefined}>姓名:</Typography>
                  <Typography variant="paragraph" placeholder={undefined}>{localSubmission.student.name}</Typography>
                </div>
                <div className="col-span-2">
                  <Typography variant="small" className="font-semibold" placeholder={undefined}>繳交時間:</Typography>
                  <Typography variant="paragraph"
                              placeholder={undefined}>{formatDate(localSubmission.created_at || '')}</Typography>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" className="mb-2" placeholder={undefined}>繳交內容</Typography>

              {localSubmission.task_file ? (
                <div className="mb-4">
                  <Typography variant="small" className="font-semibold" placeholder={undefined}>檔案:</Typography>

                  {/* 如果是圖片，顯示預覽 */}
                  {isImageFile(localSubmission.task_file) && (
                    <div className="mt-2 mb-2">
                      <img
                        src={localSubmission.task_file + `?t=${new Date().getTime()}`} // 添加時間戳防止緩存
                        alt="提交的圖片"
                        className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                        width='480px'
                      />
                    </div>
                  )}

                  <div className="mt-1 flex items-center">
                    <a
                      href={localSubmission.task_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      下載檔案
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <Typography variant="small" className="font-semibold" placeholder={undefined}>檔案:</Typography>
                  <Typography variant="paragraph" className="text-gray-500"
                              placeholder={undefined}>未繳交檔案</Typography>
                </div>
              )}

              {localSubmission.task_link ? (
                <div>
                  <Typography variant="small" className="font-semibold" placeholder={undefined}>連結:</Typography>
                  <div className="mt-1">
                    <a
                      href={localSubmission.task_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {localSubmission.task_link}
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <Typography variant="small" className="font-semibold" placeholder={undefined}>連結:</Typography>
                  <Typography variant="paragraph" className="text-gray-500"
                              placeholder={undefined}>未提供連結</Typography>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" className="mb-2" placeholder={undefined}>教師截圖上傳</Typography>
              <Typography variant="small" className="text-gray-600 mb-3 block" placeholder={undefined}>
                若學生提交的圖片不夠清楚，您可以上傳一張截圖取而代之
              </Typography>

              {screenshotPreview && (
                <div className="mb-3">
                  <div className="relative">
                    <img
                      src={screenshotPreview}
                      alt="截圖預覽"
                      className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                    <button
                      onClick={clearScreenshot}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="移除截圖"
                      type="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                    id="screenshot-upload"
                    placeholder="選擇截圖"
                    disabled={isUploading}
                    crossOrigin={undefined}/>
                  <label
                    htmlFor="screenshot-upload"
                    className="w-full cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    選擇截圖
                  </label>
                </div>
                <Button
                  onClick={handleUploadScreenshot}
                  color="blue"
                  disabled={!screenshotFile || isUploading}
                  className="flex items-center justify-center"
                  placeholder={undefined}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      上傳中...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"/>
                      </svg>
                      上傳截圖
                    </>
                  )}
                </Button>
              </div>
            </div>

            <AnalyticDetailComponent
              taskFile={localSubmission.task_file}
              taskId={localSubmission.id}
            />
          </div>
        ) : (
          <Typography variant="paragraph" className="text-center py-4" placeholder={undefined}>
            無法載入提交內容
          </Typography>
        )}
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          variant="text"
          color="red"
          onClick={onClose}
          className="mr-1"
          placeholder={undefined}
        >
          關閉
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SubmissionDetailComponent;
