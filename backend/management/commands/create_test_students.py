from django.core.management.base import BaseCommand
from django.db import transaction
from backend.models import Student, StudentClass


class Command(BaseCommand):
    help = '創建測試學生帳號'

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                # 獲取或創建測試班級
                try:
                    test_class = StudentClass.objects.get(name='test_class')
                    self.stdout.write(self.style.SUCCESS('使用現有測試班級: test_class'))
                except StudentClass.DoesNotExist:
                    test_class = StudentClass.objects.create(name='test_class')
                    self.stdout.write(self.style.SUCCESS('創建新測試班級: test_class'))

                # 創建測試學生1
                if not Student.objects.filter(student_id='test1').exists():
                    Student.objects.create_user(
                        student_id='test1',
                        name='test1',
                        password='test1',
                        student_class=test_class,
                        is_staff=False,
                        is_active=True
                    )
                    self.stdout.write(self.style.SUCCESS('成功創建測試學生: test1'))
                else:
                    self.stdout.write(self.style.WARNING('測試學生 test1 已存在'))

                # 創建測試學生2
                if not Student.objects.filter(student_id='test2').exists():
                    Student.objects.create_user(
                        student_id='test2',
                        name='test2',
                        password='test2',
                        student_class=test_class,
                        is_staff=False,
                        is_active=True
                    )
                    self.stdout.write(self.style.SUCCESS('成功創建測試學生: test2'))
                else:
                    self.stdout.write(self.style.WARNING('測試學生 test2 已存在'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'創建測試學生時發生錯誤: {str(e)}'))
