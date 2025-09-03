from django.core.management.base import BaseCommand
from django.db import transaction
from backend.models.students import Student
from backend.models.courses import Course
from backend.models.course_tasks import CourseTask
from backend.models.student_courses import StudentCourse
from backend.models.student_course_tasks import StudentCourseTask


class Command(BaseCommand):
    help = '同步所有學生的課程和課程任務'

    def add_arguments(self, parser):
        parser.add_argument(
            '--student_id',
            type=str,
            help='指定要同步的學生ID (不提供則同步所有學生)',
            required=False
        )
        parser.add_argument(
            '--class_id',
            type=int,
            help='指定要同步的班級ID (不提供則同步所有班級)',
            required=False
        )

    def handle(self, *args, **options):
        student_id = options.get('student_id')
        class_id = options.get('class_id')

        # 根據參數過濾學生
        students = Student.objects.all()
        if student_id:
            students = students.filter(student_id=student_id)
            if not students.exists():
                self.stdout.write(self.style.ERROR(f'找不到學生ID: {student_id}'))
                return

        if class_id:
            students = students.filter(student_class_id=class_id)
            if not students.exists():
                self.stdout.write(self.style.ERROR(f'找不到班級ID: {class_id} 的學生'))
                return

        total_students = students.count()
        self.stdout.write(self.style.SUCCESS(f'開始同步 {total_students} 名學生的課程和課程任務'))

        # 計數器
        created_student_courses = 0
        created_student_course_tasks = 0

        # 使用事務確保數據一致性
        with transaction.atomic():
            # 遍歷所有學生
            for student in students:
                self.stdout.write(f'處理學生: {student.name} ({student.student_id})')

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
                        self.stdout.write(f'  - 創建學生課程: {student.name} - {course.name}')

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
                            self.stdout.write(f'    - 創建學生課程任務: {student.name} - {course_task.name}')

        # 完成報告
        self.stdout.write(self.style.SUCCESS(
            f'同步完成! 處理了 {total_students} 名學生, '
            f'創建了 {created_student_courses} 個學生課程記錄, '
            f'創建了 {created_student_course_tasks} 個學生課程任務記錄'
        ))
