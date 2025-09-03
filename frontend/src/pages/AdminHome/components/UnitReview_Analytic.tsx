import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Typography,
  Alert
} from "@material-tailwind/react";

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

interface AnalysticComponentProps {
  open: boolean;
  onClose: () => void;
  studentSubmissions: StudentSubmission[];
  assignmentName: string;
}

const AnalysticComponent: React.FC<AnalysticComponentProps> = ({
  open,
  onClose,
  studentSubmissions,
  assignmentName
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);

    // 檢查是否有提交的檔案
    const hasTaskFiles = studentSubmissions.some(submission => submission.task_file);

    if (!hasTaskFiles) {
      setAlertMessage("無法進行 AI 辨識，沒有學生提交檔案！");
      setShowAlert(true);
      setIsAnalyzing(false);
      return;
    }

    // 這裡可以添加實際的 AI 辨識邏輯
    console.log("開始 AI 辨識", studentSubmissions);

    // 模擬分析過程
    setTimeout(() => {
      setIsAnalyzing(false);
      // 這裡可以處理分析結果
    }, 2000);
  };

  // 如果不是開啟狀態，不渲染任何內容
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto">
      <Card className="w-full max-w-2xl mx-4 shadow-xl" placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" placeholder={undefined}>
              AI 辨識分析 - {assignmentName}
            </Typography>
            <Button
              variant="text"
              color="gray"
              onClick={onClose}
              className="p-2"
              placeholder={undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {showAlert && (
            <Alert
              color="red"
              className="mb-4"
              onClose={() => setShowAlert(false)}
            >
              {alertMessage}
            </Alert>
          )}

          <div className="text-center py-8">
            <Button
              onClick={handleStartAnalysis}
              color="blue"
              className="flex items-center justify-center mx-auto"
              disabled={isAnalyzing}
              placeholder={undefined}
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  辨識中...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  開始 AI 辨識
                </>
              )}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalysticComponent;
