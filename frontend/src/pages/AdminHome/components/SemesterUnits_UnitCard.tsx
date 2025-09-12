import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {Material, Assignment, Unit} from "../../../store/hooks/useStudentClass";

interface UnitCardProps {
  unit: Unit;
  onViewMaterial: (material: Material) => void;
  onViewAssignment: (assignment: Assignment) => void;
  onAddContent: (courseId: number) => void;
  onEditTask?: any;
  onDeleteTask?: any;
}

const UnitCard: React.FC<UnitCardProps> = ({
                                             unit,
                                             onViewMaterial,
                                             onViewAssignment,
                                             onAddContent,
                                             onEditTask,
                                             onDeleteTask
                                           }) => {

  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const extractFileName = (filePath: string) => {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1] || parts[5] || filePath;
  };

  return (
    <Card className="shadow-md" placeholder={undefined}>
      <CardBody placeholder={undefined}>
        <Typography variant="h5" className="mb-4 text-blue-700 border-b-2 border-blue-200 pb-2"
                    placeholder={undefined}>
          {unit.name}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 教材區塊 */}
          <div>
            <Typography variant="h6" className="mb-3 text-green-600 font-semibold" placeholder={undefined}>
              📚 已提供教材
            </Typography>
            {unit.materials.length > 0 ? (
              <div className="space-y-2">
                {unit.materials.map((material, idx) =>
                  (material.content_url || material.content_file) && (
                    <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="text"
                          size="sm"
                          className="w-4/10 text-blue-500 p-0.5 text-xs underline"
                          onClick={() => onViewMaterial(material)}
                          placeholder={undefined}
                        >
                          {material.content_url ? '查看連結' : '下載檔案'}
                        </Button>
                        <span
                          className='w-72 text-sm whitespace-nowrap overflow-hidden truncate'>{material.content_url ? truncateText(material.content_url) : extractFileName(material.content_file)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">尚無教材</div>
            )}
          </div>

          {/* 作業區塊 */}
          <div>
            <Typography variant="h6" className="mb-3 text-orange-600 font-semibold" placeholder={undefined}>
              📝 單元作業
            </Typography>
            {unit.assignments.length > 0 ? (
              <div className="space-y-2">
                {unit.assignments.map((assignment, idx) => (
                  <div className='flex w-full'>
                    <div key={idx} className="flex w-full items-center justify-between p-2 bg-orange-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{idx + 1}. {assignment.name}</span>
                        <Button
                          variant="text"
                          size="sm"
                          className="text-blue-500 p-0.5 text-xs"
                          onClick={() => onViewAssignment(assignment)}
                          placeholder={undefined}
                        >
                          作業內容
                        </Button>
                      </div>
                    </div>
                    <div>
                      {(onEditTask || onDeleteTask) && (
                        <div className="flex gap-1 w-full">
                          {onEditTask && (
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="編輯"
                              onClick={() => onEditTask(unit.courseId, assignment.taskId, assignment.name, unit.materials[idx].content_url, assignment.contents)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                   stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                              </svg>
                            </button>
                          )}
                          {onDeleteTask && (
                            <button
                              className="text-red-500 hover:text-red-700 p-1"
                              title="刪除"
                              onClick={() => onDeleteTask(assignment.name, assignment.taskId)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                   stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">尚無作業</div>
            )}
          </div>

        </div>

        {/* 統一的新增按鈕 */}
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
      </CardBody>
    </Card>
  );
};

export default UnitCard;
