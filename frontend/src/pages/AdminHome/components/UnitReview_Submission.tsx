import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from "@material-tailwind/react";
import SubmissionDetailComponent from './UnitReview_SubmissionDetail';

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

interface SubmissionComponentProps {
  open: boolean;
  onClose: () => void;
  assignmentName: string;
  studentSubmissions: StudentSubmission[];
  isLoading: boolean;
}

const SubmissionComponent: React.FC<SubmissionComponentProps> = ({
  open,
  onClose,
  assignmentName,
  studentSubmissions,
  isLoading
}) => {
  // 狀態管理 - 用於顯示學生提交內容的對話框
  const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

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

  // 使用 useMemo 預先計算已提交和未提交的學生列表
  const { submittedStudents, notSubmittedStudents } = useMemo(() => {
    const submitted: StudentSubmission[] = [];
    const notSubmitted: StudentSubmission[] = [];

    studentSubmissions.forEach(submission => {
      if (submission.task_file || submission.task_link) {
        submitted.push(submission);
      } else {
        notSubmitted.push(submission);
      }
    });

    return {
      submittedStudents: submitted,
      notSubmittedStudents: notSubmitted
    };
  }, [studentSubmissions]);

  // 處理點擊學生查看提交內容
  const handleViewSubmissionDetail = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setShowSubmissionDetail(true);
  };

  // 關閉提交詳情對話框
  const handleCloseSubmissionDetail = () => {
    setShowSubmissionDetail(false);
  };

  // 渲染勾勾或叉叉
  const renderCheckOrCross = (condition: boolean) => {
    return condition ? (
      <span className="text-green-500 font-bold">✓</span>
    ) : (
      <span className="text-red-500 font-bold">✗</span>
    );
  };

  // 如果不是開啟狀態，不渲染任何內容
  if (!open) return null;

  return (
    <>
      {/* 使用固定定位和 z-index 創建懸浮卡片效果 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center overflow-auto">
        <Card className="w-full max-w-4xl mx-4 shadow-xl z-50" placeholder={undefined}>
          <CardHeader className="bg-blue-500 text-white p-4" placeholder={undefined}>
            <div className="flex justify-between items-center">
              <Typography variant="h5" placeholder={undefined}>
                {assignmentName ? `${assignmentName} - 學生繳交狀況` : '學生繳交狀況'}
              </Typography>
              <Button
                variant="text"
                color="white"
                onClick={onClose}
                className="p-2"
                placeholder={undefined}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="pt-10 max-h-[70vh] overflow-auto" placeholder={undefined}>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : studentSubmissions.length > 0 ? (
              <Tabs value="submitted">
                <TabsHeader placeholder={undefined}>
                  <Tab value="submitted" className="py-2" placeholder={undefined}>
                    <div className="flex items-center gap-2">
                      <span>已繳交</span>
                      <Chip
                        value={submittedStudents.length.toString()}
                        size="sm"
                        color="green"
                        className="flex justify-center items-cente h-5 min-w-[20px]"
                      />
                    </div>
                  </Tab>
                  <Tab value="not_submitted" className="py-2" placeholder={undefined}>
                    <div className="flex items-center gap-2">
                      <span>未繳交</span>
                      <Chip
                        value={notSubmittedStudents.length.toString()}
                        size="sm"
                        color="red"
                        className="flex justify-center items-center h-5 min-w-[20px]"
                      />
                    </div>
                  </Tab>
                </TabsHeader>
                <TabsBody placeholder={undefined}>
                  <TabPanel value="submitted">
                    {submittedStudents.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead>
                            <tr className="bg-gray-100 text-gray-700">
                              <th className="py-2 px-4 text-left">學號</th>
                              <th className="py-2 px-4 text-left">姓名</th>
                              <th className="py-2 px-4 text-center">檔案</th>
                              <th className="py-2 px-4 text-center">連結</th>
                              <th className="py-2 px-4 text-left">繳交時間</th>
                              <th className="py-2 px-4 text-center">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submittedStudents.map((submission) => (
                              <tr key={submission.student.student_id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleViewSubmissionDetail(submission)}>
                                <td className="py-2 px-4">{submission.student.student_id}</td>
                                <td className="py-2 px-4">{submission.student.name}</td>
                                <td className="py-2 px-4 text-center">{renderCheckOrCross(!!submission.task_file)}</td>
                                <td className="py-2 px-4 text-center">{renderCheckOrCross(!!submission.task_link)}</td>
                                <td className="py-2 px-4">{formatDate(submission.created_at || '')}</td>
                                <td className="py-2 px-4 text-center">
                                  <Button
                                    size="sm"
                                    variant="text"
                                    color="blue"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewSubmissionDetail(submission);
                                    }}
                                    placeholder={undefined}
                                  >
                                    查看
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <Typography variant="paragraph" className="text-center py-8" placeholder={undefined}>
                        尚無學生繳交記錄
                      </Typography>
                    )}
                  </TabPanel>
                  <TabPanel value="not_submitted">
                    {notSubmittedStudents.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead>
                            <tr className="bg-gray-100 text-gray-700">
                              <th className="py-2 px-4 text-left">學號</th>
                              <th className="py-2 px-4 text-left">姓名</th>
                              <th className="py-2 px-4 text-left">狀態</th>
                            </tr>
                          </thead>
                          <tbody>
                            {notSubmittedStudents.map((submission) => (
                              <tr key={submission.student.student_id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{submission.student.student_id}</td>
                                <td className="py-2 px-4">{submission.student.name}</td>
                                <td className="py-2 px-4 w-20">
                                  <Chip
                                    value="未繳交"
                                    color="red"
                                    size="sm"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <Typography variant="paragraph" className="text-center py-8" placeholder={undefined}>
                        所有學生都已繳交
                      </Typography>
                    )}
                  </TabPanel>
                </TabsBody>
              </Tabs>
            ) : (
              <Typography variant="paragraph" className="text-center py-8" placeholder={undefined}>
                尚無學生提交記錄
              </Typography>
            )}
          </CardBody>
          <CardFooter className="flex justify-end p-4" placeholder={undefined}>
            <Button
              variant="text"
              color="red"
              onClick={onClose}
              placeholder={undefined}
            >
              關閉
            </Button>
          </CardFooter>
        </Card>
      </div>

      <SubmissionDetailComponent
        open={showSubmissionDetail}
        onClose={handleCloseSubmissionDetail}
        submission={selectedSubmission}
      />
    </>
  );
};

export default SubmissionComponent;
