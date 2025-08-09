from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models.student_classes import StudentClass
from ..serializers.student_class_serializer import StudentClassSerializer
from ..serializers.course_serializer import CourseSerializer

from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters


class StudentClassFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = StudentClass
        fields = ['name']

class StudentClassViewSet(viewsets.ModelViewSet):
    queryset = StudentClass.objects.all()
    serializer_class = StudentClassSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = StudentClassFilter  # 使用自定義過濾器
    search_fields = ['name']  # 保留搜索功能

    @action(detail=True, methods=['get'])
    def courses(self, request, pk=None):
        """獲取特定班級的所有課程"""
        student_class = self.get_object()
        courses = student_class.courses.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def get_class_by_name(self, request, pk=None):
        """透過 name 查找班級"""
