import type { App, Plugin } from "vue";
import Chart from "@/components/Chart.vue";
import { useChart } from "@/composables/useChart";
import * as utils from "@/utils";

// 导出所有组件
export { Chart };

// 导出所有 composables
export { useChart };

// 导出工具函数
export { utils };

// 导出类型
export * from "@/types";

// 插件安装函数
const install: Plugin = {
  install(app: App, options?: any) {
    // 注册全局组件
    app.component("Chart", Chart);

    // 注册全局指令
    // app.directive('my-directive', myDirective)

    // 添加全局属性
    // app.config.globalProperties.$myPlugin = {...}

    // 使用 Element Plus 组件（如果用户安装了）
    if (options?.useElementPlus) {
      try {
        const ElementPlus = require("element-plus");
        app.use(ElementPlus);
      } catch (e) {
        console.warn("Element Plus is not installed");
      }
    }

    // 使用 Ant Design Vue 组件（如果用户安装了）
    if (options?.useAntDesignVue) {
      try {
        const AntDesignVue = require("ant-design-vue");
        app.use(AntDesignVue);
      } catch (e) {
        console.warn("Ant Design Vue is not installed");
      }
    }
  },
};

// 默认导出插件
export default install;
