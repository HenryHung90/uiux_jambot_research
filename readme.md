# UIUX JamBot Research Project

這個專案是一個基於 Django 和 React 的 UI/UX 研究平台，提供課程管理、學生作業提交和自動分析功能。系統使用 PostgreSQL 數據庫（生產環境）或 SQLite（開發環境）進行數據存儲，並通過 Nginx 提供 Web 服務。

## 技術架構

- **後端**：Django REST Framework
- **前端**：React + TypeScript + Vite
- **數據庫**：PostgreSQL (生產) / SQLite (開發)
- **Web 服務器**：Nginx + Gunicorn
- **容器化**：Docker & Docker Compose

## 目錄結構

```
uiux_jambot_research/
├── backend/                # Django 後端應用
│   ├── models/             # 數據模型
│   ├── views/              # API 視圖
│   ├── serializers/        # REST 序列化器
│   └── management/         # Django 管理命令
├── frontend/               # React 前端應用
│   ├── src/                # 源代碼
│   │   ├── components/     # React 組件
│   │   ├── pages/          # 頁面組件
│   │   ├── store/          # Redux 狀態管理
│   │   └── utils/          # 工具函數和 API 服務
├── uiux_jambot_research/   # Django 項目配置
├── nginx/                  # Nginx 配置
├── manage.py               # Django 管理腳本
├── Dockerfile              # Docker 配置
└── docker-compose.yml      # Docker Compose 配置
```

## 本地開發環境設置

以下是從零開始設置開發環境的完整步驟：

### 1. 克隆代碼庫

```bash
git clone https://github.com/your-username/uiux_jambot_research.git
cd uiux_jambot_research
```

### 2. 創建並激活虛擬環境

```bash
# 創建虛擬環境
python3 -m venv venv

# 激活虛擬環境
# 在 macOS/Linux 上:
source venv/bin/activate

# 在 Windows 上:
# venv\Scripts\activate
```

### 3. 安裝依賴

```bash
# 安裝後端依賴
pip install -r requirements.txt

# 安裝前端依賴
cd frontend
npm install
cd ..
```

### 4. 設置環境變量

創建 `.env` 文件在項目根目錄：

```
# 開發環境設置
DEBUG=True
SECRET_KEY=your_secret_key
PROCESS_ON_PRODUCTION=False

# 如果需要使用 PostgreSQL 而非 SQLite
# DB_NAME=uiux_jambot
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_HOST=localhost
# DB_PORT=5432

# API 密鑰（如果需要）
# OCR_SPACE_API_KEY=your_ocr_api_key
# OPENAI_API_KEY=your_openai_api_key
```

### 5. 初始化數據庫

```bash
# 運行數據庫遷移
python manage.py migrate

# 創建超級用戶
python manage.py createsuperuser

# 創建測試數據（可選）
python manage.py create_test_courses
python manage.py create_test_students
```

### 6. 啟動開發服務器

```bash
# 啟動 Django 後端服務器
python manage.py runserver 5418

# 在另一個終端窗口中啟動 React 前端開發服務器
cd frontend
npm run dev

# 使用 Gunicorn 開啟專案
cd frontend
npm run build
cd ..
gunicorn uiux_jambot_research.wsgi:application --bind 0.0.0.0:5418
```

現在您可以訪問：
- Django 後端：http://localhost:5418/
- React 前端：http://localhost:5173/
- Django 管理界面：http://localhost:5418/admin/

## Celery 配置與使用說明

### 簡介

本專案使用 Celery 作為非同步任務佇列系統，主要用於處理耗時的分析任務，例如 OCR 文字識別、關鍵詞分析和 AI 輔助工具分析等。這些任務在後台執行，不會阻塞網站的主要功能。

### 安裝需求

要運行 Celery，您需要安裝以下套件：

```bash
pip install celery redis django-celery-results
```

同時，您需要一個訊息中介軟體，我們使用 Redis：

```bash
# MacOS
brew install redis

# Ubuntu
sudo apt-get install redis-server
```

### 配置

Celery 配置主要在 `uiux_jambot_research/celery.py` 文件中：

```python
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
```

在 `settings.py` 中，您需要添加以下配置：

```python
# Celery settings
CELERY_BROKER_URL = 'redis://localhost:6379/0'  # 使用 Redis 作為訊息中介
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'  # 儲存任務結果
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Taipei'  # 使用台灣時區
```

### 啟動 Celery

要啟動 Celery worker，請執行以下命令：

```bash
# 在專案根目錄執行
celery -A uiux_jambot_research worker --loglevel=info
```

在開發環境中，您可以啟用自動重載，當任務代碼變更時 worker 會自動重啟：

```bash
celery -A uiux_jambot_research worker --loglevel=info --autoreload
```

要查看 Celery 的詳細日誌，可以使用 `debug` 日誌級別：

```bash
celery -A uiux_jambot_research worker --loglevel=debug
```

### 監控 Celery 任務

您可以使用 Flower 來監控 Celery 任務的執行狀況：

```bash
pip install flower
celery -A uiux_jambot_research flower
```

然後在瀏覽器中訪問 http://localhost:5555 查看任務狀態。

### 專案中的 Celery 任務

本專案中定義了以下 Celery 任務：

1. **analyze_single_task**: 分析單個學生作業，包括 OCR 文字提取、關鍵詞分析和輔助工具分析。

   ```python
   from backend.tasks import analyze_single_task
   
   # 非同步執行任務
   result = analyze_single_task.delay(task_id)
   ```

2. **batch_analyze_tasks**: 批量分析指定課程任務的所有學生作業。

   ```python
   from backend.tasks import batch_analyze_tasks
   
   # 非同步執行任務
   batch_task = batch_analyze_tasks.delay(course_task_id)
   ```

### 檢查任務狀態

您可以通過 API 端點檢查任務狀態：

```
GET /api/student-course-tasks/check_task_status/?task_id=<task_id>
```

或使用 Python 代碼：

```python
from celery.result import AsyncResult

result = AsyncResult(task_id)
status = result.status  # 'PENDING', 'STARTED', 'SUCCESS', 'FAILURE'
```

### 常見問題排解

1. **任務未開始執行**
   - 確認 Redis 服務是否運行 (`redis-cli ping` 應返回 `PONG`)
   - 確認 Celery worker 是否已啟動

2. **任務執行失敗**
   - 查看 Celery worker 日誌
   - 使用 `check_task_status` API 端點查看具體錯誤信息

3. **代碼變更後任務沒有更新**
   - 重新啟動 Celery worker
   - 或使用 `--autoreload` 選項啟動 worker

4. **資源不足**
   - 對於大量分析任務，可能需要增加 worker 數量：
     ```bash
     celery -A uiux_jambot_research worker --concurrency=4 --loglevel=info
     ```

### 重要注意事項

- 每次修改 `tasks.py` 文件後，需要重新啟動 Celery worker（除非使用了 `--autoreload` 選項）
- 確保 `OPENAI_API_KEY` 環境變量已正確設置，因為分析任務依賴於此
- 在生產環境中，建議使用 Supervisor 或 systemd 來管理 Celery worker 的運行


## 使用 Docker 進行開發（可選）

如果您偏好使用 Docker 進行開發：

```bash
# 構建並啟動容器
docker-compose up -d

# 運行數據庫遷移
docker-compose exec web python manage.py migrate

# 創建超級用戶
docker-compose exec web python manage.py createsuperuser
```

## 生產環境部署

生產環境部署使用 Docker Compose 和 Nginx：

```bash
# 設置環境變量
export PROCESS_ON_PRODUCTION=True

# 構建並啟動容器
docker-compose -f docker-compose.prod.yml up -d

# 收集靜態文件
docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput

# 運行數據庫遷移
docker-compose -f docker-compose.prod.yml exec web python manage.py migrate
```

## 常見問題解決

### 數據庫連接錯誤

如果遇到數據庫連接錯誤：

1. 確保 PostgreSQL 服務正在運行
2. 檢查數據庫憑據是否正確
3. 確保數據庫用戶有適當的權限

```bash
# 檢查 PostgreSQL 服務狀態
brew services list | grep postgresql

# 啟動 PostgreSQL 服務（如果未運行）
brew services start postgresql@15
```

### CSRF 令牌錯誤

如果遇到 CSRF 令牌錯誤：

1. 確保前端請求包含正確的 CSRF 令牌
2. 檢查 Django 設置中的 CSRF 配置
3. 確保 Nginx 正確傳遞 CSRF 令牌

### 靜態文件未加載

如果靜態文件未正確加載：

1. 運行 `python manage.py collectstatic`
2. 確保 Nginx 配置中的靜態文件路徑正確
3. 檢查文件權限

## 系統功能

- **課程管理**：創建和管理課程、單元和任務
- **學生管理**：學生註冊、分班和課程分配
- **作業提交**：學生上傳作業並接收反饋
- **自動分析**：使用 AI 分析學生提交的作業
- **數據可視化**：教師可視化查看學生進度和表現

## 貢獻指南

1. Fork 代碼庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 許可證

[MIT License](LICENSE)

## 聯繫方式

如有任何問題或建議，請聯繫項目維護者：
- 電子郵件：your.email@example.com
- GitHub：[您的 GitHub 用戶名](https://github.com/your-username)

---

希望這份 README 能幫助您快速上手 UIUX JamBot Research 項目！如果有任何問題，請隨時聯繫我們。
