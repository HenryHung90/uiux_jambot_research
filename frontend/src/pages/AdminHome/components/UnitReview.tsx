import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel
} from "@material-tailwind/react";

import { StudentCourseTaskService } from "../../../utils/services/studentCourseTaskService";
import { StudentService } from "../../../utils/services/studentService";
import {IStudentCourseTask} from "../../../utils/API/interface";


interface Material {
  name: string;
  content_url?: string;
  content_file?: string;
  task: any;
}

interface Assignment {
  name: string;
  contents?: any;
  task: any;
}

// 定義單元介面
interface Unit {
  name: string;
  courseId: number;
  materials: Material[];
  assignments: Assignment[];
}

interface Student {
  id: number;
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

interface UnitReviewProps {
  units: Unit[];
  currentClassId?: number | null;
}

const UnitReviewComponent = (props: UnitReviewProps) => {
  const { units, currentClassId } = props;

  // 狀態管理
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 處理查看作業提交狀況
  const handleViewSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsLoading(true);

    try {
      // 1. 獲取當前班級的所有學生
      const studentsResponse = await StudentService.getStudentsByClass(currentClassId);
      const students = studentsResponse;

      // 2. 獲取該作業的所有提交記錄
      const submissionsResponse = await StudentCourseTaskService.getStudentCourseTasksByCourseTask(assignment.task.id);
      const submissions = submissionsResponse;

      // 3. 創建一個映射，用於快速查找學生的提交記錄
      const submissionMap = new Map();
      submissions.forEach(submission => {
        submissionMap.set(submission.student.student_id, submission);
      });

      // 4. 為每個學生創建一個提交記錄對象，如果學生已提交，則使用已有的提交記錄
      const allStudentSubmissions = students.map(student => {
        const existingSubmission = submissionMap.get(student.student_id);
        if (existingSubmission) {
          return existingSubmission;
        } else {
          // 如果學生尚未提交，創建一個空的提交記錄
          return {
            student: student,
            course_task: assignment.task.id
          };
        }
      });

      setStudentSubmissions(allStudentSubmissions);
    } catch (error) {
      console.error("獲取學生提交狀況失敗:", error);
    } finally {
      setIsLoading(false);
      setOpenSubmissionsDialog(true);
    }
  };

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

  // 檢查學生是否有繳交作業
  const hasSubmitted = (submission: StudentSubmission) => {
    return submission.task_file || submission.task_link;
  };

  // 分類學生提交狀況
  const getSubmittedStudents = () => {
    return studentSubmissions.filter(submission => hasSubmitted(submission));
  };

  const getNotSubmittedStudents = () => {
    return studentSubmissions.filter(submission => !hasSubmitted(submission));
  };

  return (
    <>
      <div className="space-y-4 animate-fadeIn">
        {units && units.length > 0 ? (
          units.map((unit, index) => (
            <Card key={index} className="shadow-md" placeholder={undefined}>
              <CardBody placeholder={undefined}>
                <Typography variant="h5" className="mb-4 text-blue-700 border-b-2 border-blue-200 pb-2" placeholder={undefined}>
                  {unit.name}
                </Typography>

                <div>
                  <Typography variant="h6" className="mb-3 text-orange-600 font-semibold" placeholder={undefined}>
                    📝 單元作業
                  </Typography>
                  {unit.assignments.length > 0 ? (
                    <div className="space-y-2">
                      {unit.assignments.map((assignment, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-sm">{idx + 1}. {assignment.name}</span>
                          <Button
                            variant="text"
                            size="sm"
                            className="text-blue-500"
                            onClick={() => handleViewSubmissions(assignment)}
                            placeholder={undefined}
                          >
                            查看繳交狀況
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">尚無作業</div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card className="shadow-md" placeholder={undefined}>
            <CardBody className="text-center py-10" placeholder={undefined}>
              <Typography variant="h6" color="gray" className="mb-2" placeholder={undefined}>
                尚未有單元
              </Typography>
              <Typography variant="paragraph" color="gray" className="text-sm" placeholder={undefined}>
                目前沒有可供查看的單元和作業
              </Typography>
            </CardBody>
          </Card>
        )}
      </div>

      {/* 學生提交狀況對話框 */}
      <Dialog
        open={openSubmissionsDialog}
        handler={() => setOpenSubmissionsDialog(!openSubmissionsDialog)}
        placeholder={undefined}
        size="lg"
      >
        <DialogHeader placeholder={undefined}>
          {selectedAssignment ? `${selectedAssignment.name} - 學生繳交狀況` : '學生繳交狀況'}
        </DialogHeader>
        <DialogBody placeholder={undefined}>
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
                      value={getSubmittedStudents().length.toString()}
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
                      value={getNotSubmittedStudents().length.toString()}
                      size="sm"
                      color="red"
                      className="flex justify-center items-center h-5 min-w-[20px]"
                    />
                  </div>
                </Tab>
              </TabsHeader>
              <TabsBody placeholder={undefined}>
                <TabPanel value="submitted">
                  {getSubmittedStudents().length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700">
                            <th className="py-2 px-4 text-left">學號</th>
                            <th className="py-2 px-4 text-left">姓名</th>
                            <th className="py-2 px-4 text-left">繳交方式</th>
                            <th className="py-2 px-4 text-left">繳交時間</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getSubmittedStudents().map((submission) => (
                            <tr key={submission.student.id} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-4">{submission.student.student_id}</td>
                              <td className="py-2 px-4">{submission.student.name}</td>
                              <td className="py-2 px-4">
                                <Chip
                                  value={submission.task_file ? "檔案" : "連結"}
                                  color="green"
                                  size="sm"
                                />
                              </td>
                              <td className="py-2 px-4">{formatDate(submission.created_at || '')}</td>
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
                  {getNotSubmittedStudents().length > 0 ? (
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
                          {getNotSubmittedStudents().map((submission) => (
                            <tr key={submission.student.id} className="border-b hover:bg-gray-50">
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
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenSubmissionsDialog(false)}
            className="mr-1"
            placeholder={undefined}
          >
            關閉
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default UnitReviewComponent;
