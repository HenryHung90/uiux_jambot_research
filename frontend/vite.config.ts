import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var command = _a.command, mode = _a.mode;
    // 判斷當前環境
    var isProd = mode === 'production';
    return {
        plugins: [react()],
        assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
        // 根據環境設置不同的 base
        base: isProd ? '/uiux_course/' : '/',
        build: {
            outDir: 'dist',
            assetsDir: 'static', // 將靜態資源放入 static 資料夾
            emptyOutDir: true,
        },
    };
});
