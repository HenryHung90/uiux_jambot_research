from rest_framework import serializers
from ..models.courses import Course
from .student_class_serializer import StudentClassSerializer


class CourseSerializer(serializers.ModelSerializer):
    student_class_detail = StudentClassSerializer(source='student_class', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'name',
            'is_active',
            'student_class',
            'student_class_detail',
            'all_assistive_tool_analysis',
            'all_prompt_analysis',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
