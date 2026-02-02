import { ref, computed } from "vue";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

export function useChart() {
  // 基础配置
  const baseOption = ref<EChartsOption>({
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "50",
      top: "50",
      containLabel: true,
    },
  });

  // 合并选项
  const mergeOptions = (customOptions: EChartsOption): EChartsOption => {
    return {
      ...baseOption.value,
      ...customOptions,
    };
  };

  // 生成柱状图配置
  const createBarChart = (data: any[]) => {
    return mergeOptions({
      xAxis: {
        type: "category",
        data: data.map((item) => item.name),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.map((item) => item.value),
          type: "bar",
        },
      ],
    });
  };

  // 生成饼图配置
  const createPieChart = (data: any[]) => {
    return mergeOptions({
      series: [
        {
          type: "pie",
          data: data.map((item) => ({
            name: item.name,
            value: item.value,
          })),
        },
      ],
    });
  };

  return {
    baseOption,
    mergeOptions,
    createBarChart,
    createPieChart,
  };
}
