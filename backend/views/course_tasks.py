from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models.course_tasks import CourseTask
from ..serializers.course_task_serializer import CourseTaskSerializer


class CourseTaskViewSet(viewsets.ModelViewSet):
    queryset = CourseTask.objects.all()
    serializer_class = CourseTaskSerializer
    permission_classes = [IsAuthenticated]
