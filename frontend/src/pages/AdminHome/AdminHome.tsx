import React, {useState} from 'react';

import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip, Collapse,
} from "@material-tailwind/react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/outline";

import SemesterUnitsComponent from './components/SemesterUnits';
import StudentListComponent from './components/StudentList';
import UnitReviewComponent from './components/UnitReview';

import {AuthServices} from "../../utils/services/core";

import {useUserInfo} from "../../store/hooks/useUserInfo";

const AdminHome = () => {
  const [currentSemester, setCurrentSemester] = useState<string>("113-1");
  const [showSemesterList, setShowSemesterList] = useState<boolean>(true);
  const [showContentList, setShowContentList] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<'unit' | 'students' | 'review'>("unit");

  const {name} = useUserInfo();

  const semesters = [
    {
      id: "113-1",
      name: "113-1學期",
      units: [
        {
          name: "第一單元",
          materials: ["教材一", "教材二"],
          assignments: ["作業一", "作業二"]
        },
        {
          name: "第二單元",
          materials: ["教材一", "教材二"],
          assignments: ["作業一", "作業二"]
        },
        {
          name: "第三單元",
          materials: ["教材一", "教材二"],
          assignments: ["作業一", "作業二"]
        },
        {
          name: "第四單元",
          materials: [],
          assignments: []
        },
        {
          name: "第五單元",
          materials: [],
          assignments: []
        }
      ]
    },
    {
      id: "113-2",
      name: "113-2學期",
      units: [
        {
          name: "第一單元",
          materials: ["教材一"],
          assignments: ["作業一"]
        }
      ]
    }
  ];

  const contentOptions: Array<{ id: 'unit' | 'students' | 'review', name: string }> = [
    {id: "unit", name: "單元教材/作業"},
    {id: "students", name: "學生名單"},
    {id: "review", name: "單元回顧"}
  ];

  const renderContent = () => {
    switch (currentContent) {
      case "unit":
        return <SemesterUnitsComponent units={getCurrentSemester().units}/>;
      case "students":
        return <StudentListComponent currentSemester={getCurrentSemester().name}/>;
      case "review":
        return <UnitReviewComponent/>;
      default:
        return <SemesterUnitsComponent units={getCurrentSemester().units}/>;
    }
  };

  const getCurrentSemester = () => {
    return semesters.find(s => s.id === currentSemester) || semesters[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Typography variant="h3" className="text-center mb-8 text-gray-800" placeholder={undefined}>
          生成式AI輔助使用者經驗設計平台
        </Typography>

        {/* 當前學期顯示 */}
        <div className="flex justify-between mb-6 text-center">
          <div className='flex space-x-2 w-[70%]'>
            <Chip
              value={`當前登入：${name}`}
              className="bg-blue-600 text-white text-lg px-6 py-2"
            />
            <Chip
              value={getCurrentSemester().name}
              className="bg-blue-600 text-white text-lg min-w-72 px-6 py-2"
            />
          </div>
          <div>
            <Button
              variant="filled"
              color="deep-orange"
              onClick={() => AuthServices.logout()}
              placeholder={undefined}
            >
              登出
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側：隱藏式學期選擇 */}
          <Card className="lg:col-span-1" placeholder={undefined}>
            <CardBody placeholder={undefined}>
              <Button
                variant="text"
                className="w-full flex items-center justify-between p-2 text-left"
                onClick={() => setShowSemesterList(!showSemesterList)}
                placeholder={undefined}
              >
                <Typography variant="h6" placeholder={undefined}>學期選擇</Typography>
                {showSemesterList ? (
                  <ChevronUpIcon className="h-4 w-4"/>
                ) : (
                  <ChevronDownIcon className="h-4 w-4"/>
                )}
              </Button>

              <Collapse open={showSemesterList} className="border-b pt-4">
                <div className="mt-2 space-y-2">
                  {semesters.map((semester) => (
                    <Button
                      key={semester.id}
                      variant={currentSemester === semester.id ? "filled" : "text"}
                      size="sm"
                      className={`w-full justify-start ${
                        currentSemester === semester.id
                          ? "bg-blue-500 text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() => setCurrentSemester(semester.id)}
                      placeholder={undefined}
                    >
                      {semester.name}
                    </Button>
                  ))}
                </div>
              </Collapse>

              <Button
                variant="text"
                className="w-full flex items-center justify-between p-2 text-left"
                onClick={() => setShowContentList(!showContentList)}
                placeholder={undefined}
              >
                <Typography variant="h6" placeholder={undefined}>內容選擇</Typography>
                {showContentList ? (
                  <ChevronUpIcon className="h-4 w-4"/>
                ) : (
                  <ChevronDownIcon className="h-4 w-4"/>
                )}
              </Button>
              <Collapse open={showContentList} className="border-b pt-4">
                <div className="space-y-2">
                  {contentOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={currentContent === option.id ? "filled" : "text"}
                      size="sm"
                      className={`w-full justify-start ${
                        currentContent === option.id
                          ? "bg-green-500 text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() => setCurrentContent(option.id)}
                      placeholder={undefined}
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              </Collapse>
            </CardBody>
          </Card>

          {/* 右側：單元列表 */}
          <div className="lg:col-span-3 space-y-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )

}

export default AdminHome