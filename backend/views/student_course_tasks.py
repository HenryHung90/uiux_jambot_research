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


def extract_text(task):
    """使用 OCR 從作業文件中提取文本"""
    try:
        if not task.task_file:
            return {
                'success': False,
                'message': '該學生課程作業沒有上傳文件'
            }

        languages = ['ch_tra', 'en']
        try:
            reader = easyocr.Reader(languages)
        except Exception as e:
            return {
                'success': False,
                'message': f'無法創建 OCR reader: {str(e)}'
            }

        try:
            results = reader.readtext(task.task_file.path)
            extracted_text = '\n'.join([text for _, text, _ in results])
        except Exception as e:
            return {
                'success': False,
                'message': f'OCR 處理失敗: {str(e)}'
            }

        task.ocr_content = extracted_text
        task.save()
        return {
            'success': True,
            'data': extracted_text
        }

    except Exception as e:
        return {
            'success': False,
            'message': f'OCR 處理失敗: {str(e)}'
        }


def analyze_keywords(task):
    """分析文本關鍵詞並儲存結果"""
    try:
        if not task.ocr_content:
            return {
                'success': False,
                'message': '該學生課程作業沒有OCR文本內容'
            }

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
            'total_words': len(filtered_words),  # 文本中所有詞的總數量，表示文本中有多少個詞，包括重複出現的詞
            'unique_words': len(word_counts)  # 文本中不同詞的數量，每個詞只計算一次，不管它在文本中出現了多少次
        }

        task.keyword_analysis = result
        task.save()
        return {
            'success': True,
            'data': result
        }

    except Exception as e:
        return {
            'success': False,
            'message': f'關鍵詞分析失敗: {str(e)}'
        }


def analyze_assist_tools_and_prompt(task):
    """分析輔助工具與提示詞"""
    try:

        return {
            'success': True
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'輔助工具與提示詞分析失敗: {str(e)}'
        }


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
    def analyze_task(self, request, pk=None):
        """分析作業內容，包括OCR、關鍵詞、輔助工具與提示詞分析"""
        try:
            task = self.get_object()

            # 檢查是否已經有分析結果
            has_analysis = (
                    task.keyword_analysis and
                    task.assistive_tool_analysis and
                    task.prompt_analysis
            )

            if has_analysis:
                # 如果已經有分析結果，直接返回
                return Response({
                    'keyword_analysis': task.keyword_analysis,
                    'assistive_tool_analysis': task.assistive_tool_analysis,
                    'prompt_analysis': task.prompt_analysis
                })

            # 如果沒有分析結果，進行分析

            # 1. 提取文本
            if not task.ocr_content:
                ocr_result = extract_text(task)
                if not ocr_result['success']:
                    return Response(
                        {'detail': ocr_result['message']},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # 2. 分析關鍵詞
            if not task.keyword_analysis:
                keywords_result = analyze_keywords(task)
                if not keywords_result['success']:
                    return Response(
                        {'detail': keywords_result['message']},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # 3. 分析輔助工具與提示詞
            analysis_result = analyze_assist_tools_and_prompt(task)
            if not analysis_result['success']:
                return Response(
                    {'detail': analysis_result['message']},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # 刷新資料
            task.refresh_from_db()

            # 返回所有分析結果
            return Response({
                'keyword_analysis': task.keyword_analysis,
                'assistive_tool_analysis': task.assistive_tool_analysis,
                'prompt_analysis': task.prompt_analysis
            })

        except Exception as e:
            return Response(
                {'detail': f'作業分析失敗: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
