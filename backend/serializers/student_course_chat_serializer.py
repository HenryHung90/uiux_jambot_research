from rest_framework import serializers
from ..models.student_course_chats import StudentCourseChat
from .student_serializer import StudentSerializer

class StudentCourseChatSerializer(serializers.ModelSerializer):
    student_detail = StudentSerializer(source='student', read_only=True)

    class Meta:
        model = StudentCourseChat
        fields = [
            'id',
            'student_detail',
            'chat_content',
            'ai_response',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
