import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";
import { peerDependencies } from "./package.json";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true, // 生成类型声明文件
      copyDtsFiles: false,
      outDir: "dist/types",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "YxySimple",
      formats: ["es", "umd", "cjs"],
      fileName: (format) => `yxy-simple.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [...Object.keys(peerDependencies), "vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
          echarts: "echarts",
          "@vueuse/core": "VueUse",
          "element-plus": "ElementPlus",
          "ant-design-vue": "antd",
        },
      },
    },
  },
});
