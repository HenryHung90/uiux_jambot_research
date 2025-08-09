from rest_framework import serializers
from ..models.student_courses import StudentCourse
from .student_serializer import StudentSerializer
from .course_serializer import CourseSerializer


class StudentCourseSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)
    course_detail = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = StudentCourse
        fields = [
            'id',
            'student',
            'student_detail',
            'course',
            'course_detail',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']