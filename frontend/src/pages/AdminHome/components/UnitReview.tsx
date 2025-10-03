import React, {useState, useEffect} from 'react';
import {
    Button,
    Card,
    CardBody,
    Typography
} from "@material-tailwind/react";

import {StudentCourseTaskService} from "../../../utils/services/studentCourseTaskService";
import {StudentService} from "../../../utils/services/studentService";
import SubmissionComponent from "./UnitReview_Submission";
import AnalyticComponent from "./UnitReview_Analytic";
import {Assignment as CourseTask, Unit} from "../../../store/hooks/useStudentClass";

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

interface UnitReviewProps {
    units: Unit[];
    currentClassId?: number | null;
}

const UnitReviewComponent = (props: UnitReviewProps) => {
    const {units, currentClassId} = props;

    // 狀態管理
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [showAnalytic, setShowAnalytic] = useState(false);
    const [selectedCourseTask, setSelectedCourseTask] = useState<CourseTask | null>(null);
    const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleViewSubmissions = async (courseTask: CourseTask) => {
        // 先設置當前選中的作業和加載狀態
        setSelectedCourseTask(courseTask);
        setIsLoading(true);

        // 獲取當前作業的ID
        const courseTaskId = courseTask.taskId;

        try {
            const students = await StudentService.getStudentsByClass(currentClassId);
            const submissions = await StudentCourseTaskService.getStudentCourseTasksByCourseTask(courseTaskId);

            const validSubmissions = submissions.filter(submission => {
                return submission.course_task_detail.id === courseTaskId;
            });


            const submissionMap = {};
            validSubmissions.forEach(submission => {
                if (submission.student_detail && submission.student_detail.student_id) {
                    submissionMap[submission.student_detail.student_id] = submission;
                }
            });

            // 整合學生和提交資料
            const allStudentSubmissions = students.map(student => {
                const existingSubmission = submissionMap[student.student_id];

                // 如果學生有提交作業，則返回提交資料
                if (existingSubmission) {
                    return {
                        id: existingSubmission.id,
                        student: {
                            name: student.name,
                            student_id: student.student_id
                        },
                        task_file: existingSubmission.task_file,
                        task_link: existingSubmission.task_link,
                        is_analyzed: existingSubmission.is_analyzed,
                        created_at: existingSubmission.created_at,
                        course_task: courseTaskId
                    };
                }

                // 如果學生沒有提交作業，則返回基本學生資料
                return {
                    student: {
                        name: student.name,
                        student_id: student.student_id
                    },
                    course_task: courseTaskId
                };
            });

            setStudentSubmissions(allStudentSubmissions);
        } catch (error) {
            console.error("獲取學生提交狀況失敗:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 從 AI 分析返回後重新打開提交狀況卡片或是一般關閉重整
    const handleReopenSubmissions = (courseTask: CourseTask, reOpen: boolean = false) => {
        setShowSubmissions(false);
        handleViewSubmissions(courseTask);
        setShowSubmissions(reOpen);
    }

    // 開啟 AI 辨識分析
    const handleOpenAnalytic = (courseTask: CourseTask) => {
        setShowAnalytic(true);
        setSelectedCourseTask(courseTask);
    };

    // 關閉 AI 辨識分析
    const handleCloseAnalytic = () => {
        setShowAnalytic(false);
        setSelectedCourseTask(null)
    };

    return (
        <>
            <div className="space-y-4 animate-fadeIn">
                {units && units.length > 0 ? (
                    units.map((unit, index) => (
                        <Card key={index} className="shadow-md" placeholder={undefined}>
                            <CardBody placeholder={undefined}>
                                <Typography variant="h5" className="mb-4 text-blue-700 border-b-2 border-blue-200 pb-2"
                                            placeholder={undefined}>
                                    {unit.name}
                                </Typography>

                                <div>
                                    <Typography variant="h6" className="mb-3 text-orange-600 font-semibold"
                                                placeholder={undefined}>
                                        📝 單元作業
                                    </Typography>
                                    {unit.assignments.length > 0 ? (
                                        <div className="space-y-2">
                                            {unit.assignments.map((courseTask, idx) => (
                                                <div key={idx}
                                                     className="flex items-center justify-between p-2 bg-orange-50 rounded">
                                                    <span className="text-sm">{idx + 1}. {courseTask.name}</span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="text"
                                                            size="sm"
                                                            className="text-blue-500"
                                                            onClick={() => {
                                                                handleViewSubmissions(courseTask)
                                                                setShowSubmissions(true)
                                                            }}
                                                            placeholder={undefined}
                                                        >
                                                            查看繳交狀況
                                                        </Button>
                                                        <Button
                                                            variant="text"
                                                            size="sm"
                                                            className="text-purple-500"
                                                            onClick={() => {
                                                                handleOpenAnalytic(courseTask)
                                                            }}
                                                            placeholder={undefined}
                                                        >
                                                            單元 AI 分析
                                                        </Button>
                                                    </div>
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

            <SubmissionComponent
                open={showSubmissions}
                onClose={() => handleReopenSubmissions(selectedCourseTask, false)}
                onEndOfAnalytic={() => handleReopenSubmissions(selectedCourseTask, true)}
                assignmentName={selectedCourseTask?.name || ''}
                assignmentId={selectedCourseTask?.taskId || null}
                studentSubmissions={studentSubmissions}
                isLoading={isLoading}
            />

            <AnalyticComponent
                open={showAnalytic}
                onClose={handleCloseAnalytic}
                studentSubmissions={studentSubmissions}
                assignmentName={selectedCourseTask?.name || ''}
            />
        </>
    );
};

export default UnitReviewComponent;
