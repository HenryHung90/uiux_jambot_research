from django.core.management.base import BaseCommand
from django.db import transaction
from backend.models import Student, StudentClass
from django.core.management import call_command


class Command(BaseCommand):
    help = '建立一個具有超級使用者權限的教師帳號'

    def add_arguments(self, parser):
        parser.add_argument('--id', type=str, default='henry_super', help='教師ID')
        parser.add_argument('--name', type=str, default='Henry', help='教師姓名')
        parser.add_argument('--password', type=str, default='henry123', help='教師密碼')
        parser.add_argument('--class_name', type=str, default='teacher', help='班級名稱')

    def handle(self, *args, **options):
        teacher_id = options['id']
        teacher_name = options['name']
        password = options['password']
        class_name = options['class_name']

        try:
            with transaction.atomic():
                try:
                    teacher_class = StudentClass.objects.get(name=class_name)
                    self.stdout.write(self.style.SUCCESS(f'使用現有教師班級: {class_name}'))
                except StudentClass.DoesNotExist:
                    # 如果班級不存在，則創建它
                    self.stdout.write(self.style.WARNING(f'教師班級 "{class_name}" 不存在，將創建新班級'))
                    class_id = call_command('create_teacher_class', name=class_name, verbosity=0)
                    teacher_class = StudentClass.objects.get(id=class_id) if class_id else StudentClass.objects.create(
                        name=class_name)

                # 檢查教師是否已存在
                if Student.objects.filter(student_id=teacher_id).exists():
                    self.stdout.write(self.style.WARNING(f'教師ID {teacher_id} 已存在，將更新為超級使用者'))
                    teacher = Student.objects.get(student_id=teacher_id)
                    teacher.name = teacher_name
                    teacher.student_class = teacher_class
                    teacher.is_staff = True
                    teacher.is_superuser = True
                    teacher.is_active = True
                    teacher.set_password(password)
                    teacher.save()
                else:
                    # 創建新的教師超級使用者
                    Student.objects.create_superuser(
                        student_id=teacher_id,
                        name=teacher_name,
                        password=password,
                        student_class=teacher_class
                    )

                self.stdout.write(self.style.SUCCESS(
                    f'成功創建/更新教師超級使用者:\n'
                    f'ID: {teacher_id}\n'
                    f'姓名: {teacher_name}\n'
                    f'班級: {class_name}'
                ))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'創建教師超級使用者時發生錯誤: {str(e)}'))