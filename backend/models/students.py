from django.db import models
from .student_classes import StudentClass
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class StudentManager(BaseUserManager):
    def create_user(self, student_id, name, password=None, **extra_fields):
        if not student_id:
            raise ValueError('Student ID is required')
        if not name:
            raise ValueError('Name is required')

        # 確保移除 username 參數
        extra_fields.pop('username', None)
        extra_fields.pop('first_name', None)
        extra_fields.pop('last_name', None)

        student = self.model(
            student_id=student_id,
            name=name,
            **extra_fields
        )
        student.set_password(password)
        student.save(using=self._db)
        return student

    def create_superuser(self, student_id, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        return self.create_user(student_id, name, password, **extra_fields)


class Student(AbstractBaseUser):
    student_id = models.CharField(
        max_length=20,
        unique=True,
        primary_key=True,
        verbose_name="學號"
    )
    student_class = models.ForeignKey(
        StudentClass,
        on_delete=models.CASCADE,
        related_name='students',
        verbose_name="班級"
    )
    name = models.CharField(max_length=100, verbose_name="姓名")
    is_active = models.BooleanField(default=True, verbose_name="是否啟用")
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = StudentManager()

    USERNAME_FIELD = 'student_id'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'students'
        ordering = ['-student_class_id', 'student_id']
        verbose_name = '學生'
        verbose_name_plural = '學生'

    def __str__(self):
        return f"{self.student_id} - {self.name}"
