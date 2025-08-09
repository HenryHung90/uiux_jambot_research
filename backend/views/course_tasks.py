from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models.course_tasks import CourseTask
from ..serializers.course_task_serializer import CourseTaskSerializer


class CourseTaskViewSet(viewsets.ModelViewSet):
    queryset = CourseTask.objects.all()
    serializer_class = CourseTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CourseTask.objects.all()

        # 依課程過濾
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)

        # 依班級過濾
        student_class_id = self.request.query_params.get('student_class', None)
        if student_class_id:
            queryset = queryset.filter(student_class_id=student_class_id)

        return queryset