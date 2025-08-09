from rest_framework import serializers
from ..models.student_course_tasks import StudentCourseTask
from .student_serializer import StudentSerializer
from .course_serializer import CourseSerializer
from .course_task_serializer import CourseTaskSerializer


class StudentCourseTaskSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    course_detail = CourseSerializer(source='course', read_only=True)
    course_task_detail = CourseTaskSerializer(source='course_task', read_only=True)

    class Meta:
        model = StudentCourseTask
        fields = [
            'id',
            'student',
            'student_detail',
            'course',
            'course_detail',
            'course_task',
            'course_task_detail',
            'task_file',
            'task_link',
            'assistive_tool_analysis',
            'prompt_analysis',
            'teacher_mark',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']