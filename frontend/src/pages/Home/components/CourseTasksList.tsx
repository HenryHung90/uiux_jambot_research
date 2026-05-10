import React from 'react';
import {Link} from 'react-router-dom';
import {IStudentCourse, IStudentCourseTask} from "../../../utils/API/interface";
import {Button} from "@material-tailwind/react";

interface CourseTasksListProps {
  course: IStudentCourse;
  tasks: IStudentCourseTask[];
  onTaskClick: (task: IStudentCourseTask) => void;
}

interface TaskItemProps {
  task: IStudentCourseTask;
  onTaskClick: (task: IStudentCourseTask) => void;
}

interface TaskListProps {
  tasks: IStudentCourseTask[];
  onTaskClick: (task: IStudentCourseTask) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({task, onTaskClick}) => {
  return (
    <div
      className="bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onTaskClick(task)}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{task.course_task_detail.name}</span>
        <span className="text-sm text-gray-500">
          {new Date(task.created_at || '').toLocaleDateString()}
        </span>
      </div>
      <div className="mt-1 flex items-center text-sm">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          task.task_file || task.task_link
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {task.task_file || task.task_link ? '已提交' : '未提交'}
        </span>
        {task.teacher_mark && Object.keys(task.teacher_mark).length > 0 && (
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            已評分
          </span>
        )}
      </div>
    </div>
  );
};

const TaskList: React.FC<TaskListProps> = ({tasks, onTaskClick}) => {
  return tasks?.length > 0 ? (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-sm">暫無作業</p>
  );
};

const CourseTasksList: React.FC<CourseTasksListProps> = ({
  course,
  tasks,
  onTaskClick
}) => {
  return (
    <div key={course.id} className="border-b pb-4 last:border-b-0">
      <h3 className="text-lg font-medium mb-2">{course.course_detail.name} - {course.course_detail.course_type}</h3>
      {course.course_detail.course_type == 'normal' &&
        <TaskList tasks={tasks} onTaskClick={onTaskClick}/>
      }
      {
        course.course_detail.course_type == 'chat' &&
        <Link to={`/chat/${course.course_detail.id}`}>
          <Button color='cyan' placeholder={undefined}>進入交談介面</Button>
        </Link>
      }
    </div>
  );
};

export default CourseTasksList;
