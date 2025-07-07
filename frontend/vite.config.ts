import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
  // 根據環境設置不同的 base
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'static', // 將靜態資源放入 static 資料夾
    emptyOutDir: true,
  },
})
