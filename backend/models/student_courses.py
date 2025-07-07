from django.db import models
from .students import Student
from .courses import Course

class StudentCourse(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='student_courses',
        verbose_name="學生"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='student_courses',
        verbose_name="課程"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_courses'
        verbose_name = '學生課程'
        verbose_name_plural = '學生課程'
        unique_together = ['student', 'course']

    def __str__(self):
        return f"{self.student.name} - {self.course.name}"