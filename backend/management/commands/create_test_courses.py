from django.core.management.base import BaseCommand
from django.db import transaction
from django.core.files.base import ContentFile
from django.core.files import File
import os
from backend.models import StudentClass, Course, CourseTask


class Command(BaseCommand):
    help = '創建測試班級、課程和課程任務'

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                try:
                    test_class = StudentClass.objects.get(name='test_class')
                    self.stdout.write(self.style.SUCCESS('使用現有測試班級: test_class'))
                except StudentClass.DoesNotExist:
                    test_class = StudentClass.objects.create(name='test_class')
                    self.stdout.write(self.style.SUCCESS('創建新測試班級: test_class'))

                course1, created1 = Course.objects.get_or_create(
                    name='test course 1',
                    defaults={
                        'student_class': test_class,
                        'is_active': True
                    }
                )
                if created1:
                    self.stdout.write(self.style.SUCCESS('成功創建測試課程: test course 1'))
                else:
                    self.stdout.write(self.style.WARNING('測試課程 test course 1 已存在'))

                course2, created2 = Course.objects.get_or_create(
                    name='test course 2',
                    defaults={
                        'student_class': test_class,
                        'is_active': True
                    }
                )
                if created2:
                    self.stdout.write(self.style.SUCCESS('成功創建測試課程: test course 2'))
                else:
                    self.stdout.write(self.style.WARNING('測試課程 test course 2 已存在'))

                task1_1, created1_1 = CourseTask.objects.get_or_create(
                    name='task 1-1',
                    course=course1,
                    defaults={
                        'student_class': test_class,
                        'content_url': 'https://www.youtube.com',
                        'contents': None,
                    }
                )
                if created1_1:
                    self.stdout.write(self.style.SUCCESS('成功創建課程任務: task 1-1 (YouTube URL)'))
                else:
                    self.stdout.write(self.style.WARNING('課程任務 task 1-1 已存在'))
                    task1_1.content_url = 'https://www.youtube.com'
                    task1_1.save()

                task1_2, created1_2 = CourseTask.objects.get_or_create(
                    name='task 1-2',
                    course=course1,
                    defaults={
                        'student_class': test_class,
                    }
                )
                if created1_2:
                    self.stdout.write(self.style.SUCCESS('成功創建課程任務: task 1-2 (PDF文件)'))
                else:
                    self.stdout.write(self.style.WARNING('課程任務 task 1-2 已存在'))

                pdf_path = os.path.join('files', 'test_file', 'test_PDF.pdf')
                upload_pdf_path = os.path.join('files', 'course_task_files', 'test_PDF.pdf')

                is_pdf_exist = os.path.exists(pdf_path) and os.path.exists(upload_pdf_path)

                if is_pdf_exist:
                    with open(pdf_path, 'rb') as f:
                        task1_2.content_file.save('test_PDF.pdf', File(f), save=True)
                    self.stdout.write(self.style.SUCCESS(f'成功上傳PDF文件到課程任務 task 1-2'))
                else:
                    self.stdout.write(self.style.ERROR(f'PDF 文件不存在或已經建立: {pdf_path}'))

                task2_1, created2_1 = CourseTask.objects.get_or_create(
                    name='task 2-1',
                    course=course2,
                    defaults={
                        'student_class': test_class,
                        'content_url': 'https://www.google.com',
                        'contents': None,
                    }
                )
                if created2_1:
                    self.stdout.write(self.style.SUCCESS('成功創建課程任務: task 2-1 (Google URL)'))
                else:
                    self.stdout.write(self.style.WARNING('課程任務 task 2-1 已存在'))
                    # 更新URL
                    task2_1.content_url = 'https://www.google.com'
                    task2_1.save()

                task2_2, created2_2 = CourseTask.objects.get_or_create(
                    name='task 2-2',
                    course=course2,
                    defaults={
                        'student_class': test_class,
                    }
                )
                if created2_2:
                    self.stdout.write(self.style.SUCCESS('成功創建課程任務: task 2-2 (PDF文件)'))
                else:
                    self.stdout.write(self.style.WARNING('課程任務 task 2-2 已存在'))

                if is_pdf_exist:
                    with open(pdf_path, 'rb') as f:
                        task2_2.content_file.save('test_PDF.pdf', File(f), save=True)
                    self.stdout.write(self.style.SUCCESS(f'成功上傳 PDF 文件到課程任務 task 2-2'))
                else:
                    self.stdout.write(self.style.ERROR(f'PDF 文件不存在或已經建立: {pdf_path}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'創建測試課程和任務時發生錯誤: {str(e)}'))
