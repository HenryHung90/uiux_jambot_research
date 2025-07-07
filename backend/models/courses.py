from django.db import models
from .student_classes import StudentClass

class Course(models.Model):
    name = models.CharField(max_length=200, verbose_name="課程名稱")
    is_active = models.BooleanField(default=True, verbose_name="是否啟用")
    student_class = models.ForeignKey(
        StudentClass,
        on_delete=models.CASCADE,
        related_name='courses',
        verbose_name="班級"
    )
    contents = models.FileField(
        upload_to='course_contents/',
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
        verbose_name="單元內所有輔助工具分析"
    )
    all_prompt_analysis = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="單元內所有提示分析"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        verbose_name = '課程'
        verbose_name_plural = '課程'

    def __str__(self):
        return f"{self.name} - {self.student_class.name}"
