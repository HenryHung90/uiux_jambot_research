from django.db import models
from .students import Student
from .courses import Course


class StudentCourseChat(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='student',
        verbose_name="學生"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='course',
        verbose_name="課程"
    )

    chat_content = models.TextField(
        blank=True,
        null=True,
        verbose_name="使用者詢問問題"
    )

    ai_response = models.TextField(
        blank=True,
        null=True,
        verbose_name="AI 回應內容"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_course_chats'
        verbose_name = '學生課程聊天'
        verbose_name_plural = '學生課程聊天'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.name} - {self.course.name}"
