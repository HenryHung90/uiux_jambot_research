from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models.course_tasks import CourseTask
from ..models.student_course_tasks import StudentCourseTask
from ..serializers.course_task_serializer import CourseTaskSerializer


class CourseTaskViewSet(viewsets.ModelViewSet):
    queryset = CourseTask.objects.all()
    serializer_class = CourseTaskSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course_task = serializer.save()
        student_class = course_task.student_class
        students = student_class.students.all()

        student_course_tasks = []
        for student in students:
            student_course_task = StudentCourseTask(
                student=student,
                course=course_task.course,
                course_task=course_task
            )
            student_course_tasks.append(student_course_task)

        if student_course_tasks:
            StudentCourseTask.objects.bulk_create(student_course_tasks)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
