from django.db import models

class StudentClass(models.Model):
    name = models.CharField(max_length=100, verbose_name="班級名稱")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_classes'
        verbose_name = '學生班級'
        verbose_name_plural = '學生班級'

    def __str__(self):
        return self.name