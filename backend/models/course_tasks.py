from django.db import models
from .student_classes import StudentClass
from .courses import Course

def get_default_contents():
    return {'content': 'This is new content'}

class CourseTask(models.Model):
    name = models.CharField(max_length=200, verbose_name="作業名稱")
    student_class = models.ForeignKey(
        StudentClass,
        on_delete=models.CASCADE,
        related_name='course_tasks',
        verbose_name="班級"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='course_tasks',
        verbose_name="課程"
    )
    contents = models.JSONField(
        default=get_default_contents,
        blank=True,
        null=True,
        verbose_name="作業內容"
    )
    content_file = models.FileField(
        upload_to='course_task_files/',
        blank=True,
        null=True,
        verbose_name="課程內容檔案"
    )
    content_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="課程內容連結"
    )
    all_assistive_tool_analysis = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="作業內所有輔助工具分析"
    )
    all_prompt_analysis = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="作業內所有提示分析"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'course_tasks'
        verbose_name = '課程作業'
        verbose_name_plural = '課程作業'

    def __str__(self):
        return f"{self.name} - {self.course.name}"
