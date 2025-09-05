from os import system

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
import json
import os
import openai
import base64
from PIL import Image
import io

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

        # 檢查文件是否存在
        if not os.path.exists(task.task_file.path):
            return {
                'success': False,
                'message': f'文件不存在: {task.task_file.path}'
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
        similar_words = {
            'api': ['apis', 'ap', 'api'],
        }

        for main_word, variants in similar_words.items():
            total_count = sum(word_counts[variant] for variant in variants if variant in word_counts)
            if total_count > 0:
                for variant in variants:
                    if variant != main_word and variant in word_counts:
                        del word_counts[variant]
                word_counts[main_word] = total_count

        top_words = word_counts.most_common(50)

        result = {
            'top_keywords': dict(top_words),
            'total_words': len(filtered_words),
            'unique_words': len(word_counts)
        }

        # 確保結果可以被 JSON 序列化
        try:
            json.dumps(result)
        except TypeError as e:
            return {
                'success': False,
                'message': f'分析結果無法序列化為 JSON: {str(e)}'
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
        if not task.task_file:
            return {
                'success': False,
                'message': '該學生課程作業沒有上傳文件'
            }

        # 檢查文件是否存在
        if not os.path.exists(task.task_file.path):
            return {
                'success': False,
                'message': f'文件不存在: {task.task_file.path}'
            }

        # 確保已有OCR內容
        if not task.ocr_content:
            ocr_result = extract_text(task)
            if not ocr_result['success']:
                return {
                    'success': False,
                    'message': f'無法提取文本內容: {ocr_result["message"]}'
                }
            task.refresh_from_db()  # 確保獲取最新的OCR內容

        # 檢查 OpenAI API 密鑰
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            return {
                'success': False,
                'message': 'OpenAI API 密鑰未設置'
            }

        # 設置 OpenAI API 密鑰
        openai.api_key = api_key

        # 準備 GPT-4o 的提示詞
        system_prompt = """
你是一個專門進行文本內容分析的助手，請根據使用者提供的OCR文本進行以下分析並以指定格式回覆：

工具使用分析：
根據文本內容，識別並統計使用過的工具名稱及其使用次數，包含以下工具：
- quick_question
- rabbit_hole
- rewrite_this
- turn_this_into_a
- Ideate
- teach_me_about_this
- give_me
- similar_stuff
- summarize
- code_this_up
- custom

Prompt分析：
分析文本中的輸入內容，並幫我做關鍵字統整以及其出現次數。

討論主題分析：
根據文本內容，分析使用過程中的討論主題並提供簡單描述。

回覆格式要求：
僅回覆純 JSON 格式，不要包含任何代碼塊標記（如 ```json），格式如下：
{
  "assistive_tool_analysis": {
    "quick_question": 0,
    "rabbit_hole": 0,
    "rewrite_this": 0,
    "turn_this_into_a": 0,
    "Ideate": 0,
    "teach_me_about_this": 0,
    "give_me": 0,
    "similar_stuff": 0,
    "summarize": 0,
    "code_this_up": 0,
    "custom": 0
  },
  "prompt_analysis": {
    "discussion_topics": {
      "topic": "討論主題",
      "description": "描述"
    },
    "prompts": [
      {"keyword": "關鍵詞1", "times": 次數},
      {"keyword": "關鍵詞2", "times": 次數},
      ...
    ]
  }
}
嚴格遵守格式，不提供額外文字或解釋，不要使用代碼塊。所有分析結果需基於使用者提供的OCR文本。
請仔細分析文本中的每一個細節，確保不遺漏任何工具使用和文本內容。
        """

        try:
            response = openai.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"以下是OCR提取的文本內容，請分析：\n\n{task.ocr_content}"}
                ],
                temperature=0.1,  # 降低溫度以獲得更確定的結果
                max_tokens=2000
            )
        except Exception as e:
            return {
                'success': False,
                'message': f'OpenAI API 調用失敗: {str(e)}'
            }

        # 解析 API 回應
        try:
            content = response.choices[0].message.content
            if content.startswith("```") and "```" in content:
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:].strip()  # 移除 "json" 標記

            content = content.strip()
            analysis_result = json.loads(content)

        except json.JSONDecodeError as e:
            return {
                'success': False,
                'message': f'GPT-4o 回應解析失敗: {str(e)}, 原始回應: {response.choices[0].message.content}'
            }

        # 將分析結果保存到任務中
        try:
            task.assistive_tool_analysis = analysis_result.get("assistive_tool_analysis", {})
            task.prompt_analysis = analysis_result.get("prompt_analysis", {})
            task.save()
        except Exception as e:
            return {
                'success': False,
                'message': f'無法保存分析結果: {str(e)}'
            }

        return {
            'success': True,
            'data': {
                'assistive_tool_analysis': task.assistive_tool_analysis,
                'prompt_analysis': task.prompt_analysis
            }
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
