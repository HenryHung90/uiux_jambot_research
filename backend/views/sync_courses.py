from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

# 導入所需模型
from backend.models.students import Student
from backend.models.courses import Course
from backend.models.course_tasks import CourseTask
from backend.models.student_courses import StudentCourse
from backend.models.student_course_tasks import StudentCourseTask


@api_view(['GET'])
@permission_classes([IsAdminUser])
def sync_student_courses(request):
    """同步學生課程和課程任務"""
    try:
        # 獲取所有學生
        students = Student.objects.all()
        total_students = students.count()
        print(f'開始同步 {total_students} 名學生的課程和課程任務')

        # 計數器
        created_student_courses = 0
        created_student_course_tasks = 0

        # 使用事務確保數據一致性
        with transaction.atomic():
            # 遍歷所有學生
            for student in students:
                print(f'處理學生: {student.name} ({student.student_id})')

                # 獲取學生班級的所有課程
                courses = Course.objects.filter(student_class=student.student_class)

                # 遍歷課程
                for course in courses:
                    # 檢查學生是否已有此課程的記錄
                    student_course, created = StudentCourse.objects.get_or_create(
                        student=student,
                        course=course
                    )

                    if created:
                        created_student_courses += 1
                        print(f'  - 創建學生課程: {student.name} - {course.name}')

                    # 獲取課程的所有任務
                    course_tasks = CourseTask.objects.filter(course=course)

                    # 遍歷課程任務
                    for course_task in course_tasks:
                        # 檢查學生是否已有此課程任務的記錄
                        student_course_task, created = StudentCourseTask.objects.get_or_create(
                            student=student,
                            course=course,
                            course_task=course_task
                        )

                        if created:
                            created_student_course_tasks += 1
                            print(f'    - 創建學生課程任務: {student.name} - {course_task.name}')

        # 完成報告
        print(
            f'同步完成! 處理了 {total_students} 名學生, '
            f'創建了 {created_student_courses} 個學生課程記錄, '
            f'創建了 {created_student_course_tasks} 個學生課程任務記錄'
        )

        return Response({
            'status': 'success',
            'message': '同步完成',
            'data': {
                'total_students': total_students,
                'created_student_courses': created_student_courses,
                'created_student_course_tasks': created_student_course_tasks
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'同步過程中發生錯誤: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
