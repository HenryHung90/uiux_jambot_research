from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.http import HttpResponse
from ..models.students import Student
from ..models.student_classes import StudentClass
from ..serializers.student_serializer import StudentSerializer, StudentCreateSerializer

import pandas as pd
import io

from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters


class StudentFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    student_class = django_filters.NumberFilter(field_name="student_class")
    is_active = django_filters.BooleanFilter(field_name="is_active")

    class Meta:
        model = Student
        fields = ['name', 'student_class', 'is_active']


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'student_id'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = StudentFilter
    search_fields = ['name', 'student_id']

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        return StudentSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request, student_id=None):
        """變更學生密碼 (需要舊密碼驗證)"""
        student = get_object_or_404(Student, student_id=student_id)

        if request.user.is_superuser or request.user.student_id == student_id:
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')

            if not old_password or not new_password:
                return Response(
                    {'message': '需要提供舊密碼和新密碼'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not student.check_password(old_password):
                return Response(
                    {'message': '舊密碼不正確'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            student.set_password(new_password)
            student.save()
            return Response({'message': '密碼更改成功'})

        return Response(
            {'message': '沒有權限執行此操作'},
            status=status.HTTP_403_FORBIDDEN
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def change_password_admin(self, request, student_id=None):
        """管理員直接變更學生密碼 (不需要舊密碼驗證)"""
        student = get_object_or_404(Student, student_id=student_id)
        new_password = request.data.get('new_password')

        if not new_password:
            return Response(
                {'message': '需要提供新密碼'},
                status=status.HTTP_400_BAD_REQUEST
            )

        student.set_password(new_password)
        student.save()
        return Response({'message': '密碼更改成功'})

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, student_id=None):
        """切換學生的啟用狀態"""
        student = get_object_or_404(Student, student_id=student_id)
        student.is_active = not student.is_active
        student.save()
        serializer = self.get_serializer(student)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def download_template(self, request):
        """下載學生批量導入範本"""
        # 創建一個包含範例數據的 DataFrame
        df = pd.DataFrame({
            'student_class': ['班級名稱'],  # 班級名稱，而不是ID
            'student_id': ['s12345678'],  # 學號
            'name': ['學生姓名'],  # 姓名
            'password': ['password123'],  # 密碼
        })

        # 創建一個 BytesIO 對象
        output = io.BytesIO()

        # 將 DataFrame 寫入 Excel 文件
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='學生資料')

        # 設置文件指針到開始位置
        output.seek(0)

        # 創建 HTTP 響應
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=student_import_template.xlsx'

        return response

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def bulk_import(self, request):
        """批量導入學生資料"""
        # 檢查是否有上傳文件
        if 'file' not in request.FILES:
            return Response(
                {'message': '請上傳Excel文件'},
                status=status.HTTP_400_BAD_REQUEST
            )

        excel_file = request.FILES['file']

        # 檢查文件類型
        if not excel_file.name.endswith(('.xls', '.xlsx')):
            return Response(
                {'message': '請上傳Excel文件 (.xls 或 .xlsx)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 讀取Excel文件
            df = pd.read_excel(excel_file)

            # 檢查必要的列是否存在
            required_columns = ['student_class', 'student_id', 'password', 'name']
            missing_columns = [col for col in required_columns if col not in df.columns]

            if missing_columns:
                return Response(
                    {'message': f'缺少必要的列: {", ".join(missing_columns)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 預處理數據
            results = {
                'success': 0,
                'failed': 0,
                'errors': []
            }

            # 使用事務確保數據一致性
            with transaction.atomic():
                for index, row in df.iterrows():
                    try:
                        # 獲取班級 - 使用班級名稱查詢
                        student_class_name = str(row['student_class'])
                        try:
                            student_class = StudentClass.objects.get(name=student_class_name)
                        except StudentClass.DoesNotExist:
                            raise ValueError(f"班級名稱 '{student_class_name}' 不存在")

                        # 準備學生數據
                        student_data = {
                            'student_id': str(row['student_id']),
                            'name': row['name'],
                            'password': row['password'],
                            'student_class': student_class,
                            'is_active': True  # 預設為啟用狀態
                        }

                        # 檢查學生ID是否已存在
                        if Student.objects.filter(student_id=student_data['student_id']).exists():
                            raise ValueError(f"學號 {student_data['student_id']} 已存在")

                        # 創建學生
                        Student.objects.create_user(
                            student_id=student_data['student_id'],
                            name=student_data['name'],
                            password=student_data['password'],
                            student_class=student_data['student_class'],
                            is_active=student_data['is_active']
                        )

                        results['success'] += 1

                    except Exception as e:
                        results['failed'] += 1
                        results['errors'].append({
                            'row': index + 2,  # Excel行號從1開始，標題行是1，所以數據從2開始
                            'student_id': str(row.get('student_id', '')),
                            'error': str(e)
                        })

            # 返回結果
            return Response({
                'message': f'成功導入 {results["success"]} 名學生，失敗 {results["failed"]} 名',
                'details': results
            })

        except Exception as e:
            return Response(
                {'message': f'處理Excel文件時出錯: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
