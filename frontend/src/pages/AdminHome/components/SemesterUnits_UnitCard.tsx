import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {Material, Assignment, Unit} from "../../../store/hooks/useStudentClass";
import UnitMaterialsSection from "./UnitMaterialsSection";
import UnitAssignmentsSection from "./UnitAssignmentsSection";

interface UnitCardProps {
  unit: Unit;
  onViewMaterial: (material: Material) => void;
  onViewAssignment: (assignment: Assignment) => void;
  onAddContent: (courseId: number) => void;
  onEditTask?: any;
  onDeleteTask?: any;
  onChangeCourseType?: (courseId: number) => void;
  onDownloadStudentCourseChats?: (courseId: number) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({
                                             unit,
                                             onViewMaterial,
                                             onViewAssignment,
                                             onAddContent,
                                             onEditTask,
                                             onDeleteTask,
                                             onChangeCourseType,
                                             onDownloadStudentCourseChats
                                           }) => {

  return (
    <Card className="shadow-md" placeholder={undefined}>
      <CardBody placeholder={undefined}>
        <Typography variant="h5" className="mb-4 text-blue-700 border-b-2 border-blue-200 pb-2"
                    placeholder={undefined}>
          {unit.name} - {unit.courseType === 'normal' ? '一般課程' : '聊天課程'}
          <Button className='ml-4' placeholder={undefined} onClick={() => onChangeCourseType(unit.courseId)}>
            切換課程模式
          </Button>
        </Typography>

        {unit.courseType == 'normal' && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 教材區塊 */}
            <UnitMaterialsSection
                materials={unit.materials}
                onViewMaterial={onViewMaterial}
            />

          {/* 作業區塊 */}
            <UnitAssignmentsSection
                courseId={unit.courseId}
                assignments={unit.assignments}
                materials={unit.materials}
                onViewAssignment={onViewAssignment}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
            />
        </div>}

        {unit.courseType == 'chat' && <div className="grid grid-cols-1 gap-6">
            <Button color='cyan' placeholder={undefined} onClick={()=>onDownloadStudentCourseChats(unit.courseId)}>查看學生聊天狀況</Button>
        </div>}

        {/* 統一的新增按鈕 */}
        {unit.courseType == 'normal' &&
            <div className="mt-4 flex justify-center">
                <Button
                    variant="text"
                    size="sm"
                    className="text-blue-600"
                    onClick={() => onAddContent(unit.courseId)}
                    placeholder={undefined}
                >
                    + 新增教材與作業
                </Button>
            </div>
        }
      </CardBody>
    </Card>
  );
};

export default UnitCard;
