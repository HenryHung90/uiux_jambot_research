from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from ..models import CourseTask, StudentCourse
from ..models.courses import Course
from ..models.students import Student
from ..serializers.course_serializer import CourseSerializer

from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters

from ..serializers.course_task_serializer import CourseTaskSerializer


class CourseFilter(django_filters.FilterSet):
    student_class = django_filters.NumberFilter(field_name="student_class")
    is_active = django_filters.BooleanFilter(field_name="is_active")
    name = django_filters.CharFilter(field_name="name")

    class Meta:
        model = Course
        fields = ['student_class', 'is_active', 'name']


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = CourseFilter
    search_fields = ['is_active', 'student_class', 'name']

    def create(self, request, *args, **kwargs):
        """創建課程並為該班級的所有學生創建 StudentCourse 記錄"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        course = serializer.instance

        students = Student.objects.filter(student_class=course.student_class, is_active=True)

        for student in students:
            StudentCourse.objects.create(student=student, course=course)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['put', 'patch'])
    def update_content(self, request, pk=None):
        """更新課程內容（文件或URL）"""
        course = self.get_object()

        if 'contents' in request.FILES:
            course.contents = request.FILES['contents']

        if 'content_url' in request.data:
            course.content_url = request.data['content_url']

        course.save()
        serializer = self.get_serializer(course)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def toggle_active(self, request, pk=None):
        """切換課程的啟用狀態"""
        course = self.get_object()
        course.is_active = not course.is_active
        course.save()
        serializer = self.get_serializer(course)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def course_tasks(self, request, pk=None):
        """獲取屬於該課程的所有課程任務"""
        course = self.get_object()
        course_tasks = CourseTask.objects.filter(course=course)
        serializer = CourseTaskSerializer(course_tasks, many=True)
        return Response(serializer.data)
