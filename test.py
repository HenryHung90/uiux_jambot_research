# test_mps_django.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "uiux_jambot_research.settings")
django.setup()

import torch
import easyocr

print(f"PyTorch 版本: {torch.__version__}")
print(f"MPS 是否編譯支持: {torch.backends.mps.is_built()}")
print(f"MPS 是否可用: {torch.backends.mps.is_available()}")

if torch.backends.mps.is_available():
    device = torch.device("mps")
    x = torch.randn(5, 5).to(device)
    print(f"MPS 張量創建成功: {x.device}")

    # 測試 EasyOCR 與 MPS
    try:
        reader = easyocr.Reader(['ch_tra', 'en'], gpu=True)
        print("EasyOCR 初始化成功，使用 GPU")
    except Exception as e:
        print(f"EasyOCR 初始化失敗: {e}")