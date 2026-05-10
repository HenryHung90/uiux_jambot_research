import React from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { Assignment, Material } from "../../../store/hooks/useStudentClass";

interface UnitAssignmentsSectionProps {
  courseId: number;
  assignments: Assignment[];
  materials: Material[];
  onViewAssignment: (assignment: Assignment) => void;
  onEditTask?: (courseId: number, taskId: number, name: string, contentUrl: string, content: any) => void;
  onDeleteTask?: (name: string, taskId: number) => void;
}

const UnitAssignmentsSection: React.FC<UnitAssignmentsSectionProps> = ({
  courseId,
  assignments,
  materials,
  onViewAssignment,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <div>
      <Typography variant="h6" className="mb-3 text-orange-600 font-semibold" placeholder={undefined}>
        📝 單元作業
      </Typography>
      {assignments.length > 0 ? (
        <div className="space-y-2">
          {assignments.map((assignment, idx) => (
            <div className='flex w-full' key={idx}>
              <div className="flex w-full items-center justify-between p-2 bg-orange-50 rounded">
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
                        onClick={() => onEditTask(courseId, assignment.taskId, assignment.name, materials[idx]?.content_url, assignment.contents?.content)}
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
  );
};

export default UnitAssignmentsSection;

