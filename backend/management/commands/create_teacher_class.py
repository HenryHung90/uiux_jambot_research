from django.core.management.base import BaseCommand
from backend.models import StudentClass
from django.db import transaction


class Command(BaseCommand):
    help = '創建教師班級'

    def add_arguments(self, parser):
        parser.add_argument('--name', type=str, default='teacher', help='教師班級名稱')

    def handle(self, *args, **options):
        class_name = options['name']

        try:
            with transaction.atomic():
                # 檢查班級是否已存在
                if StudentClass.objects.filter(name=class_name).exists():
                    teacher_class = StudentClass.objects.get(name=class_name)
                    self.stdout.write(self.style.WARNING(f'教師班級 "{class_name}" 已存在'))
                else:
                    # 創建新的教師班級
                    teacher_class = StudentClass.objects.create(name=class_name)
                    self.stdout.write(self.style.SUCCESS(f'成功創建教師班級 "{class_name}"'))

                self.stdout.write(self.style.SUCCESS(f'班級ID: {teacher_class.id}'))
                return None

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'創建教師班級時發生錯誤: {str(e)}'))
            return None
