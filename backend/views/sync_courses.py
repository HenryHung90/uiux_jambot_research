from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.core.management import call_command
from io import StringIO
import sys


@api_view(['GET'])
@permission_classes([IsAdminUser])
def sync_student_courses(request):
    """同步學生課程和課程任務"""

    # 捕獲命令輸出
    stdout_backup = sys.stdout
    output_buffer = StringIO()
    sys.stdout = output_buffer

    try:
        # 準備命令參數
        command_kwargs = {}

        # 執行同步命令
        call_command('sync_student_courses', **command_kwargs)

        # 獲取命令輸出
        output = output_buffer.getvalue()

        return Response({
            'status': 'success',
            'message': '同步完成',
            'details': output
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'同步過程中發生錯誤: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    finally:
        # 恢復標準輸出
        sys.stdout = stdout_backup
