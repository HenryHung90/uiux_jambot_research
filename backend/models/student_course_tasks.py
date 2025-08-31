from tabnanny import verbose

from django.db import models
from .students import Student
from .courses import Course
from .course_tasks import CourseTask


class StudentCourseTask(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='student_course_tasks',
        verbose_name="學生"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='student_course_tasks',
        verbose_name="課程"
    )
    course_task = models.ForeignKey(
        CourseTask,
        on_delete=models.CASCADE,
        related_name='student_course_tasks',
        verbose_name="課程作業"
    )
    task_file = models.FileField(
        upload_to='student_tasks/',
        blank=True,
        null=True,
        verbose_name="作業檔案"
    )
    task_link = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="作業連結"
    )

    assistive_tool_analysis = models.JSONField(
        default=dict,
        blank=True,
        null=True,
        verbose_name="輔助工具分析"
    )

    prompt_analysis = models.JSONField(
        default=dict,
        blank=True,
        null=True,
        verbose_name="提示分析"
    )

    teacher_mark = models.JSONField(
        default=dict,
        blank=True,
        null=True,
        verbose_name="老師評語評分"
    )

    ocr_content = models.TextField(
        blank=True,
        null=True,
        verbose_name="OCR 處理後的文本內容"
    )

    keyword_analysis = models.JSONField(
        default=dict,
        blank=True,
        null=True,
        verbose_name="關鍵詞分析"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_course_tasks'
        verbose_name = '學生課程作業'
        verbose_name_plural = '學生課程作業'
        unique_together = ['student', 'course_task']

    def __str__(self):
        return f"{self.student.name} - {self.course_task.name}"
