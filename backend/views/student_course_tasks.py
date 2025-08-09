from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import IntegrityError
from ..models.student_course_tasks import StudentCourseTask
from ..serializers.student_course_task_serializer import StudentCourseTaskSerializer


class StudentCourseTaskViewSet(viewsets.ModelViewSet):
    queryset = StudentCourseTask.objects.all()
    serializer_class = StudentCourseTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = StudentCourseTask.objects.all()

        # 依學生過濾
        student_id = self.request.query_params.get('student', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)

        # 依課程過濾
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)

        # 依作業過濾
        course_task_id = self.request.query_params.get('course_task', None)
        if course_task_id:
            queryset = queryset.filter(course_task_id=course_task_id)

        return queryset

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {'detail': '該學生已經提交過此作業'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def submit_mark(self, request, pk=None):
        """教師提交評分"""
        task = self.get_object()
        teacher_mark = request.data.get('teacher_mark')

        if not teacher_mark:
            return Response(
                {'detail': '請提供評分內容'},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.teacher_mark = teacher_mark
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)