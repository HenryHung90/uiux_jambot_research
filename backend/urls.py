from django.urls import path, include
from rest_framework.routers import DefaultRouter

from backend.views.core import *

from backend.views.students import StudentViewSet
from backend.views.student_classes import StudentClassViewSet
from backend.views.courses import CourseViewSet
from backend.views.course_tasks import CourseTaskViewSet
from backend.views.student_courses import StudentCourseViewSet
from backend.views.student_course_tasks import StudentCourseTaskViewSet

API_CORE = [
    path('get_csrf_token', get_csrf_token, name='get_csrf_token'),
    path('login', login_system, name='login'),
    path('logout', logout_system, name='logout'),
    path('user_info', userinfo_view, name='user_info'),
]

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'student-classes', StudentClassViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'course-tasks', CourseTaskViewSet)
router.register(r'student-courses', StudentCourseViewSet)
router.register(r'student-course-tasks', StudentCourseTaskViewSet)

urlpatterns = [
    *API_CORE,
    path('', include(router.urls)),
]
