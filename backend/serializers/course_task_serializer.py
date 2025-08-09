from rest_framework import serializers
from ..models.course_tasks import CourseTask
from .course_serializer import CourseSerializer
from .student_class_serializer import StudentClassSerializer


class CourseTaskSerializer(serializers.ModelSerializer):
    course_detail = CourseSerializer(source='course', read_only=True)
    student_class_detail = StudentClassSerializer(source='student_class', read_only=True)

    class Meta:
        model = CourseTask
        fields = [
            'id',
            'name',
            'student_class',
            'student_class_detail',
            'course',
            'course_detail',
            'contents',
            'all_assistive_tool_analysis',
            'all_prompt_analysis',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']