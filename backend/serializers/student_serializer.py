from rest_framework import serializers
from ..models.students import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['student_id', 'name', 'student_class', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class StudentCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = ['student_id', 'name', 'student_class', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        student = Student(**validated_data)
        student.set_password(password)
        student.save()
        return student