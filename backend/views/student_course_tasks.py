from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import IntegrityError

from collections import Counter
import re
import easyocr
import jieba
from stopwordsiso import stopwords

from ..models.student_course_tasks import StudentCourseTask
from ..serializers.student_course_task_serializer import StudentCourseTaskSerializer


class StudentCourseTaskViewSet(viewsets.ModelViewSet):
    queryset = StudentCourseTask.objects.all()
    serializer_class = StudentCourseTaskSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {'detail': '該學生已經提交過此作業'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def submit_mark(self, request, pk=None):
        """教師提交評分"""
        task = self.get_object()
        teacher_mark = request.data.get('teacher_mark')

        if not teacher_mark:
            return Response(
                {'detail': '請提供評分內容'},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.teacher_mark = teacher_mark
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def extract_text(self, request, pk=None):
        """使用 OCR 從作業文件中提取文本"""
        try:
            task = self.get_object()

            if not task.task_file:
                return Response(
                    {'message': '該學生課程作業沒有上傳文件'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            languages = ['ch_tra', 'en']
            try:
                reader = easyocr.Reader(languages)
            except Exception as e:
                return Response(
                    {'message': f'無法創建 OCR reader: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                results = reader.readtext(task.task_file.path)
                extracted_text = '\n'.join([text for _, text, _ in results])
            except Exception as e:
                return Response(
                    {'message': f'OCR 處理失敗: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            task.ocr_content = extracted_text
            task.save()

            serializer = self.get_serializer(task)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'detail': f'OCR 處理失敗: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def analyze_keywords(self, request, pk=None):
        """分析文本關鍵詞並儲存結果"""
        try:
            task = self.get_object()

            if not task.ocr_content:
                return Response(
                    {'detail': '該學生課程作業沒有OCR文本內容'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            text = task.ocr_content.lower()

            words = jieba.cut(text)
            stop_words = set(stopwords(['zh', 'en']))
            filtered_words = [word.lower() for word in words if
                              word.strip() and word.lower() not in stop_words and len(word) > 1 and not re.match(
                                  r'^\d+$', word)]

            word_counts = Counter(filtered_words)

            # 手動合併特定的相似詞
            # 這裡可以添加您知道的特定相似詞
            # similar_words = {
            #     'api': ['apis', 'ap', 'api'],
            # }

            # for main_word, variants in similar_words.items():
            #     total_count = sum(word_counts[variant] for variant in variants if variant in word_counts)
            #     if total_count > 0:
            #         for variant in variants:
            #             if variant != main_word and variant in word_counts:
            #                 del word_counts[variant]
            #         word_counts[main_word] = total_count

            top_words = word_counts.most_common(25)

            result = {
                'top_keywords': dict(top_words),
                'total_words': len(filtered_words), # 文本中所有詞的總數量，表示文本中有多少個詞，包括重複出現的詞
                'unique_words': len(word_counts)    # 文本中不同詞的數量，每個詞只計算一次，不管它在文本中出現了多少次
            }

            task.keyword_analysis = result
            task.save()

            serializer = self.get_serializer(task)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'message': f'關鍵詞分析失敗: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
