import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../index';
import {fetchStudentClassesData, setCurrentClassId} from '../slices/studentClassSlice';
import {useEffect} from 'react';

export interface Material {
  name: string;
  taskId: number;
  content_url?: string;
  content_file?: string;
}

export interface Assignment {
  name: string;
  taskId: number;
  contents?: any;
}

export interface Unit {
  name: string;
  courseId: number;
  materials: Material[];
  assignments: Assignment[];
}

export const useStudentClass = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    studentClasses,
    loading,
    error,
    currentClassId
  } = useSelector((state: RootState) => state.studentClass);

  const currentClass = studentClasses.find(cls => cls.id === currentClassId) || null;

  const currentClassCourses = currentClass ? currentClass.courses : [];

  const currentClassTasks = currentClassCourses.flatMap(course => course.courseTasks);

  const fetchData = () => {
    dispatch(fetchStudentClassesData());
  };

  const selectClass = (classId: number) => {
    dispatch(setCurrentClassId(classId));
  };

  const getUnitsForCurrentClass = () => {
    if (!currentClass) return [];

    return currentClassCourses.map(course => {
      const materials: Material[] = [];
      const assignments: Assignment[] = [];

      course.courseTasks.forEach(task => {
        console.log(task)
        materials.push({
          name: task.name,
          taskId: task.id,
          content_url: task.content_url || '',
          content_file: `${import.meta.env.VITE_APP_TEST_DNS}/${task.content_file}` || '',
        });
        assignments.push({
          name: task.name,
          taskId: task.id,
          contents: task.contents || null,
        });
      });

      return {
        name: course.name,
        courseId: course.id,
        materials,
        assignments
      };
    });
  };

  return {
    studentClasses,
    loading,
    error,
    currentClassId,
    currentClass,
    currentClassCourses,
    currentClassTasks,
    fetchData,
    selectClass,
    getUnitsForCurrentClass
  };
};
