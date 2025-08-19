import React, {useEffect} from 'react';

// UI imports
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip, Collapse,
} from "@material-tailwind/react";
import {ChevronDownIcon, ChevronUpIcon, PlusIcon} from "@heroicons/react/24/outline";

// Component imports
import SemesterUnitsComponent from './components/SemesterUnits';
import StudentListComponent from './components/StudentList';
import UnitReviewComponent from './components/UnitReview';

// Store imports
import {useUserInfo} from "../../store/hooks/useUserInfo";
import {useStudentClass} from "../../store/hooks/useStudentClass";

// Service imports
import {AuthServices} from "../../utils/services/core";
import {StudentClassService} from "../../utils/services/studentClassService";

const AdminHome = () => {
  const [showSemesterList, setShowSemesterList] = React.useState<boolean>(true);
  const [showContentList, setShowContentList] = React.useState<boolean>(false);
  const [currentContent, setCurrentContent] = React.useState<'unit' | 'students' | 'review'>("unit");

  const {name} = useUserInfo();
  const {
    studentClasses,
    loading,
    currentClassId,
    currentClass,
    fetchData,
    selectClass,
    getUnitsForCurrentClass
  } = useStudentClass();

  useEffect(() => {
    // 獲取班級、課程和課程任務數據
    fetchData();
  }, []);

  const contentOptions: Array<{ id: 'unit' | 'students' | 'review', name: string }> = [
    {id: "unit", name: "單元教材/作業"},
    {id: "students", name: "學生名單"},
    {id: "review", name: "單元回顧"}
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64">
        <Typography variant="h6" className="text-gray-500" placeholder={undefined}>
          載入中...
        </Typography>
      </div>;
    }

    if (studentClasses.length === 0) {
      return <div className="flex justify-center items-center h-64">
        <Typography variant="h6" className="text-gray-500" placeholder={undefined}>
          尚無班級資料
        </Typography>
      </div>;
    }

    switch (currentContent) {
      case "unit":
        return <SemesterUnitsComponent
          units={getUnitsForCurrentClass()}
          currentClassId={currentClassId}
          onDataChange={fetchData}
        />
      case "students":
        return <StudentListComponent currentClassId={currentClassId} currentClassName={currentClass.name || ""}/>;
      case "review":
        return <UnitReviewComponent units={getUnitsForCurrentClass()} currentClassId={currentClassId}/>;
      default:
        return <SemesterUnitsComponent
          units={getUnitsForCurrentClass()}
          currentClassId={currentClassId}
          onDataChange={fetchData}
        />
    }
  };

  const handleAddNewClass = async () => {
    try {
      const className = prompt("請輸入新班級名稱");
      if (className) {
        await StudentClassService.createStudentClass(className);
        fetchData(); // 重新獲取資料
      }
    } catch (error) {
      console.error("新增班級失敗:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Typography variant="h3" className="text-center mb-8 text-gray-800" placeholder={undefined}>
          生成式AI輔助使用者經驗設計平台
        </Typography>

        {/* 當前學期顯示 */}
        <div className="flex flex-col gap-y-2 md:flex-row justify-between items-center mb-6 text-center">
          <div className='flex flex-col gap-y-2 items-center md:flex-row md:space-x-2 w-[70%]'>
            <Chip
              value={`當前登入：${name}`}
              className="bg-blue-600 text-white text-lg px-6 py-2"
            />
            {!loading && studentClasses.length > 0 && currentClass && (
              <Chip
                value={currentClass.name}
                className="bg-blue-600 text-white text-lg min-w-44 px-6 py-2"
              />
            )}
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
                  {loading ? (
                    <div className="text-center p-2">載入中...</div>
                  ) : (
                    <>
                      {studentClasses.map((cls) => (
                        <Button
                          key={cls.id}
                          variant={currentClassId === cls.id ? "filled" : "text"}
                          size="sm"
                          className={`w-full justify-start ${
                            currentClassId === cls.id
                              ? "bg-blue-500 text-white"
                              : "text-gray-600"
                          }`}
                          onClick={() => selectClass(cls.id)}
                          placeholder={undefined}
                        >
                          {cls.name}
                        </Button>
                      ))}
                      <Button
                        color='orange'
                        variant='text'
                        size="sm"
                        className='flex items-center justify-center w-full'
                        onClick={handleAddNewClass}
                        placeholder={undefined}
                      >
                        <PlusIcon className="h-4 w-4"/>新增學期
                      </Button>
                    </>
                  )}
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
  );
};

export default AdminHome;
