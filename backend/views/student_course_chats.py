import os
from io import BytesIO

import openai
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

from ..models.student_course_chats import StudentCourseChat
from ..serializers.student_course_chat_serializer import StudentCourseChatSerializer

OPEN_AI_KEY = os.environ.get("OPENAI_API_KEY")


class StudentCourseChatViewSet(viewsets.ModelViewSet):
    queryset = StudentCourseChat.objects.all()
    serializer_class = StudentCourseChatSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def get_by_pagination(self, request):
        try:
            course_id = request.data.get('course_id')
            if not course_id:
                return Response(
                    {'error': 'course_id 是必需的'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            page = int(request.data.get('page', 1))
            page_size = int(request.data.get('page_size', 10))

            # 只查詢當前已認證的學生的聊天記錄
            chats = StudentCourseChat.objects.filter(
                student=request.user,
                course_id=course_id
            ).order_by('-created_at')

            start = (page - 1) * page_size
            end = start + page_size

            paginated_chats = chats[start:end]
            serializer = self.get_serializer(paginated_chats, many=True)

            return Response({
                'count': chats.count(),
                'page': page,
                'page_size': page_size,
                'results': serializer.data
            })
        except ValueError:
            return Response(
                {'error': 'page 和 page_size 必須是整數'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def chat_with_ai(self, request):
        course_id = request.data.get('course_id')
        chat_content = request.data.get('chat_content')

        if not course_id or not chat_content:
            return Response(
                {'error': 'course_id 和 message 是必需的'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not OPEN_AI_KEY:
            return {
                'success': False,
                'message': 'OpenAI API 密鑰未設置'
            }

        # 設置 OpenAI API 密鑰
        openai.api_key = OPEN_AI_KEY

        system_prompt = """
你是一個專門進行學生課程聊天的AI助手，請根據使用者提供的聊天內容進行回覆，並以指定格式回覆：
1. 回覆內容應該簡潔明了，直接回答學生的問題或提供相關資訊。
2. 回覆應該具有教育性，幫助學生理解課程內容或解決學習上的問題。
3. 回覆應該友好且鼓勵學生繼續學習，避免使用過於正式或冷漠的語氣。
4. 回覆應該根據學生的問題提供具體的建議或解決方案，而不是僅僅提供一般性的回答。
"""
        history_chats = StudentCourseChat.objects.filter(
            student=request.user,
            course_id=course_id
        ).order_by('created_at')[:3]

        messages = [{"role": "system", "content": system_prompt}]

        # 將歷史對話加入 messages 列表
        for chat in history_chats:  # 只取最近的 3 條對話
            messages.append({"role": "user", "content": chat.chat_content})
            messages.append({"role": "assistant", "content": chat.ai_response})

        # 加入當前的聊天內容
        messages.append({"role": "user", "content": chat_content})

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=1.0,
            max_tokens=2000
        )

        ai_response = response.choices[0].message.content

        new_chat = StudentCourseChat.objects.create(
            student_id=request.user.student_id,
            course_id=course_id,
            chat_content=chat_content,
            ai_response=ai_response
        )
        serializer = self.get_serializer(new_chat)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def get_all_student_chats_by_course_id(self, request):
        try:
            course_id = request.data.get('course_id')
            if not course_id:
                return Response(
                    {'error': 'course_id 是必需的'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            chats = StudentCourseChat.objects.filter(
                course_id=course_id
            ).order_by('student_id', 'created_at')

            if not chats.exists():
                return Response(
                    {'error': '課程沒有紀錄'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Group chats by student
            students_chats = {}
            for chat in chats:
                student_id = chat.student.student_id if chat.student else 'N/A'
                if student_id not in students_chats:
                    students_chats[student_id] = []
                students_chats[student_id].append(chat)

            # Create a workbook with separate sheets for each student
            wb = Workbook()
            wb.remove(wb.active)  # Remove default sheet

            for student_id, student_chats in students_chats.items():
                ws = wb.create_sheet(title=f"student_{student_id}")

                # 设置表头
                headers = ['學生ID', '學生姓名', '學生訊息', 'AI回應', '時間']
                ws.append(headers)

                # 设置表头样式
                header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
                header_font = Font(color="FFFFFF", bold=True)

                for cell in ws[1]:
                    cell.fill = header_fill
                    cell.font = header_font
                    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

                for chat in student_chats:
                    student_name = chat.student.name if chat.student else 'N/A'
                    chat_content = chat.chat_content or ''
                    ai_response = chat.ai_response or ''
                    created_at = chat.created_at.strftime('%Y-%m-%d %H:%M:%S') if chat.created_at else ''

                    ws.append([
                        student_id,
                        student_name,
                        chat_content,
                        ai_response,
                        created_at
                    ])

                ws.column_dimensions['A'].width = 12
                ws.column_dimensions['B'].width = 15
                ws.column_dimensions['C'].width = 30
                ws.column_dimensions['D'].width = 30
                ws.column_dimensions['E'].width = 20

                for row in ws.iter_rows(min_row=2, max_row=ws.max_row):
                    for cell in row:
                        cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

            # 保存到内存中的字节流
            output = BytesIO()
            wb.save(output)
            output.seek(0)

            # 返回文件
            response = FileResponse(
                output,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="course_chats.xlsx"'
            return response

        except Exception as e:
            return Response(
                {'error': f'生成 Excel 失敗: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
