from django.urls import path
from backend.views.core import *

urlpatterns = []

API_CORE = [
    path('get_csrf_token', get_csrf_token, name='get_csrf_token'),
    path('login', login_system, name='login'),
    path('logout', logout_system, name='logout'),
    path('user_info', userinfo_view, name='user_info'),
]



urlpatterns += API_CORE
