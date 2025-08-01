import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

interface StudentListProps {
  currentSemester: string;
}

const StudentListComponent = (props: StudentListProps) => {
  const {currentSemester} = props;
  const students = [
    {
      id: 1,
      grade: "大三",
      name: "王小明",
      studentId: "A1234567",
    },
    {
      id: 2,
      grade: "大三",
      name: "李小華",
      studentId: "A1234568",
    },
    {
      id: 3,
      grade: "大三",
      name: "張小美",
      studentId: "A1234569",
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 功能按鈕區 */}
      <Card placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button className="bg-green-500 hover:bg-green-600" placeholder={undefined}>
                新增學生
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600" placeholder={undefined}>
                批量新增學生
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                label="搜尋學生"
                icon={<MagnifyingGlassIcon className="h-5 w-5"/>}
                className="min-w-[200px]"
                crossOrigin={undefined}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 學生列表 */}
      <Card placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <Typography variant="h5" className="mb-4 text-gray-800" placeholder={undefined}>
            學生名單 - {currentSemester}
          </Typography>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 font-semibold">年級</th>
                <th className="text-left p-3 font-semibold">姓名</th>
                <th className="text-left p-3 font-semibold">學號</th>
                <th className="text-left p-3 font-semibold">操作</th>
              </tr>
              </thead>
              <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{student.grade}</td>
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.studentId}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button variant="text" size="sm" className="text-blue-500" placeholder={undefined}>
                        修改密碼
                      </Button>
                      <Button variant="text" size="sm" className="text-green-500" placeholder={undefined}>
                        修改姓名
                      </Button>
                      <Button variant="text" size="sm" className="text-orange-500" placeholder={undefined}>
                        作業狀況
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              尚無學生資料
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentListComponent;