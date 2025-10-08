# 第一階段：建構前端 (frontend)
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY frontend ./
RUN npm run build

# 第二階段：建構後端 (backend)
FROM --platform=linux/arm64 python:3.11-slim

# 安裝系統依賴（包括 poppler-utils 和其他工具）
RUN apt-get update && apt-get install -y \
    libpq-dev gcc poppler-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /app

# 複製 requirements.txt 並安裝依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製專案檔案到容器中
COPY . .

# 複製前端建構結果到後端容器
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# 設定環境變數
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=uiux_jambot_research.settings

# 清理不必要的文件（示例：node_modules）
RUN rm -rf /app/frontend/node_modules

# 創建啟動腳本
RUN echo '#!/bin/bash\n\
# 啟動 Celery worker 在背景執行\n\
celery -A uiux_jambot_research worker --loglevel=info > /var/log/celery.log 2>&1 &\n\
\n\
# 啟動 Django 應用\n\
gunicorn uiux_jambot_research.wsgi:application --bind 0.0.0.0:8000\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# 創建日誌目錄
RUN mkdir -p /var/log/

# 運行啟動腳本
CMD ["/app/start.sh"]
