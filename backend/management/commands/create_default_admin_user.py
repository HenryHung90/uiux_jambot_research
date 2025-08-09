from django.core.management.base import BaseCommand
from django.db import transaction
from backend.models import Student, StudentClass
import os


class Command(BaseCommand):
    help = '建立默認教師帳號'

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                try:
                    teacher_class = StudentClass.objects.get(name='teacher')
                    self.stdout.write(self.style.SUCCESS('使用現有教師班級: teacher'))
                except StudentClass.DoesNotExist:
                    teacher_class = StudentClass.objects.create(name='teacher')
                    self.stdout.write(self.style.SUCCESS('創建新教師班級: teacher'))

                super_user_id = os.getenv('SUPER_USER_ID', 'henry_super')
                super_user_name = os.getenv('SUPER_USER_NAME', 'Henry')
                super_user_password = os.getenv('SUPER_USER_PASSWORD', 'henry123')

                if not Student.objects.filter(student_id=super_user_id).exists():
                    Student.objects.create_superuser(
                        student_id=super_user_id,
                        name=super_user_name,
                        password=super_user_password,
                        student_class=teacher_class
                    )
                    self.stdout.write(self.style.SUCCESS(f'成功創建超級用戶 {super_user_id}'))
                else:
                    self.stdout.write(self.style.WARNING(f'超級用戶 {super_user_id} 已存在'))

                teacher_user_id = os.getenv('TEACHER_USER_ID', 'yzu_cj')
                teacher_user_name = os.getenv('TEACHER_USER_NAME', 'Huang CJ')
                teacher_user_password = os.getenv('TEACHER_USER_PASSWORD', 'yzu_cjcj')

                if not Student.objects.filter(student_id=teacher_user_id).exists():
                    Student.objects.create_user(
                        student_id=teacher_user_id,
                        name=teacher_user_name,
                        password=teacher_user_password,
                        student_class=teacher_class,
                        is_staff=True,
                        is_active=True
                    )
                    self.stdout.write(self.style.SUCCESS(f'成功創建教師用戶 {teacher_user_id}'))
                else:
                    self.stdout.write(self.style.WARNING(f'教師用戶 {teacher_user_id} 已存在'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'創建默認用戶時發生錯誤: {str(e)}'))
