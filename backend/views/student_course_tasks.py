from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import IntegrityError
from celery.result import AsyncResult


from ..models.student_course_tasks import StudentCourseTask
from ..serializers.student_course_task_serializer import StudentCourseTaskSerializer
from ..tasks import batch_analyze_tasks
from ..utils.analysis_utils import extract_text, analyze_keywords, analyze_assist_tools_and_prompt


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

            # # 檢查是否已經有分析結果
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
                    'prompt_analysis': task.prompt_analysis,
                    'is_analyzed': task.is_analyzed
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

            # 4. 更新分析狀態
            task.is_analyzed = True
            task.save()

            # 刷新資料
            task.refresh_from_db()

            # 返回所有分析結果
            return Response({
                'keyword_analysis': task.keyword_analysis,
                'assistive_tool_analysis': task.assistive_tool_analysis,
                'prompt_analysis': task.prompt_analysis,
                'is_analyzed': task.is_analyzed
            })

        except Exception as e:
            return Response(
                {'detail': f'作業分析失敗: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def patch_analyze_task(self, request, pk=None):
        """批量分析指定課程任務的所有學生作業"""
        try:
            # 獲取當前的學生課程任務
            task = self.get_object()
            course_task_id = task.course_task.id

            # 啟動批量處理 Celery 任務
            batch_task = batch_analyze_tasks.delay(course_task_id)

            # 返回任務 ID 和狀態
            return Response({
                'batch_task_id': batch_task.id,
                'message': f'批量分析任務已啟動'
            })

        except Exception as e:
            return Response(
                {'detail': f'批量分析啟動失敗: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # 添加檢查任務狀態的端點
    @action(detail=False, methods=['get'])
    def check_task_status(self, request):
        """檢查任務狀態"""
        task_id = request.query_params.get('task_id')

        if not task_id:
            return Response(
                {'detail': '請提供任務ID'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = AsyncResult(task_id)

        response_data = {
            'task_id': task_id,
            'status': 'PENDING',
        }

        if result.status == "SUCCESS" and result.result:
            if isinstance(result.result, dict):
                child_task = result.result.get('task_details')
                all_completed = True

                for task in child_task:
                    if 'celery_task_id' in task:
                        child_result = AsyncResult(task['celery_task_id'])
                        task['status'] = child_result.status
                        if child_result.status != 'SUCCESS':
                            all_completed = False
                            break
                if all_completed:
                    response_data['status'] = 'SUCCESS'

        return Response(response_data)
