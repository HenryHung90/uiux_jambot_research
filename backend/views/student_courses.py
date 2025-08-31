from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from ..models import StudentCourseTask
from ..models.student_courses import StudentCourse
from ..serializers.student_course_serializer import StudentCourseSerializer

from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters

from ..serializers.student_course_task_serializer import StudentCourseTaskSerializer


class StudentCourseFilter(django_filters.FilterSet):
    student = django_filters.CharFilter(field_name="student__student_id")
    course = django_filters.NumberFilter(field_name="course_id")

    class Meta:
        model = StudentCourse
        fields = ['student', 'course']


class StudentCourseViewSet(viewsets.ModelViewSet):
    queryset = StudentCourse.objects.all()
    serializer_class = StudentCourseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = StudentCourseFilter

    @action(detail=True, methods=['get'])
    def student_course_tasks(self, request, pk=None):
        """獲取特定學生課程的所有學生課程任務"""
        student_course = self.get_object()
        student_course_tasks = StudentCourseTask.objects.filter(
            student=student_course.student,
            course=student_course.course
        )

        serializer = StudentCourseTaskSerializer(student_course_tasks, many=True)
        return Response(serializer.data)
