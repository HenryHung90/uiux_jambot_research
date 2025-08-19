from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from datetime import datetime, timedelta
from django.utils import timezone

from backend.models import Student, LoginAttempt


# anti
def anti_force_login_attempt(ip_address, acc):
    # 檢查過去一小時內的失敗嘗試次數
    one_hour_ago = timezone.now() - timedelta(hours=1)
    failed_attempts = LoginAttempt.objects.filter(
        ip_address=ip_address,
        success=False,
        timestamp__gte=one_hour_ago
    ).count()

    # 如果失敗次數達到或超過 5 次，則封鎖該 IP
    if failed_attempts >= 5:
        # 設置封鎖時間為 10 分鐘
        block_time = 10
        block_until = timezone.now() + timedelta(minutes=block_time)

        # 記錄封鎖
        LoginAttempt.objects.create(
            ip_address=ip_address,
            student_id=acc,
            success=False,
            blocked_until=block_until
        )

        return Response({
            'message': f'由於多次登入失敗，您的 IP 已被暫時封鎖。請 {block_time} 分鐘後再試。',
            'status': 403
        }, status=status.HTTP_403_FORBIDDEN)


# CSRF Token
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'message': 'CSRF cookie set'})


# 登入系統
@api_view(['POST'])
@permission_classes([AllowAny])
def login_system(request):
    try:
        data = request.data
        acc = data.get('student_id')
        psw = data.get('password')

        # 獲取客戶端 IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')

        # 確認帳號密碼是否為空
        if acc is None or psw is None or acc == '' or psw == '':
            # 記錄失敗的登入嘗試
            LoginAttempt.objects.create(
                ip_address=ip_address,
                student_id=acc,
                success=False
            )
            return Response({'message': '帳號或密碼不得為空', 'status': 400}, status=status.HTTP_400_BAD_REQUEST)

        anti_force_login_attempt(ip_address, acc)

        # 檢查用戶是否存在且是否啟用
        try:
            student = Student.objects.get(student_id=acc)
            if not student.is_active:
                # 記錄失敗的登入嘗試
                LoginAttempt.objects.create(
                    ip_address=ip_address,
                    student_id=acc,
                    success=False
                )
                return Response({'message': '此帳號已被停用', 'status': 403}, status=status.HTTP_403_FORBIDDEN)
        except Student.DoesNotExist:
            # 用戶不存在，但不提早返回，讓 authenticate 處理
            pass

        # 登入
        user = authenticate(student_id=acc, password=psw, request=request._request)

        if user is None:
            # 記錄失敗的登入嘗試
            LoginAttempt.objects.create(
                ip_address=ip_address,
                student_id=acc,
                success=False
            )
            return Response({'message': '無此用戶或帳號密碼錯誤', 'status': 403}, status=status.HTTP_403_FORBIDDEN)

        if not user.is_active:
            # 記錄失敗的登入嘗試
            LoginAttempt.objects.create(
                ip_address=ip_address,
                student_id=acc,
                success=False
            )
            return Response({'message': '此帳號已被停用', 'status': 403}, status=status.HTTP_403_FORBIDDEN)

        # 登入成功，記錄成功，登入嘗試
        LoginAttempt.objects.create(
            ip_address=ip_address,
            student_id=acc,
            success=True
        )

        student_info = Student.objects.get(student_id=acc)
        login(request._request, user)

        return Response(
            {'message': 'success', 'name': student_info.name, 'student_id': student_info.student_id,
             'is_teacher': student_info.is_superuser},
            status=status.HTTP_200_OK)

    except Exception as e:
        print(f'Login Error: {e}')
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# 登出系統
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def logout_system(request):
    try:
        if not request.user.is_authenticated:
            return Response({'message': '未有帳戶登入', 'status': 400}, status=status.HTTP_400_BAD_REQUEST)

        logout(request._request)
        return Response({'message': 'logout success', 'status': 200}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Logout Error: {e}')
        return Response({'Logout Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# User Info
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def userinfo_view(request):
    try:
        if request.user.is_authenticated:
            student_info = Student.objects.get(student_id=request.user.student_id)
            return Response(
                {'message': 'success', 'name': student_info.name, 'student_id': student_info.student_id,
                 'is_teacher': student_info.is_superuser},
                status=status.HTTP_200_OK)
        else:
            return Response({'isAuthenticated': request.user.is_authenticated}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'Userinfo Error: {e}')
        return Response({'userinfo Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
