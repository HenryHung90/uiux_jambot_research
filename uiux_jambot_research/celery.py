# uiux_jambot_research/celery.py

import os
from celery import Celery

# 設定 Django 預設設定模組
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uiux_jambot_research.settings')

app = Celery('uiux_jambot_research')

# 使用 Django 的設定檔案
app.config_from_object('django.conf:settings', namespace='CELERY')

# 自動從所有已註冊的 Django app 中加載 task
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
