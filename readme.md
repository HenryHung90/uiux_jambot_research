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