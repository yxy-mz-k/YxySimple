<template>
  <div class="ChartContent">
    <div class="chart" ref="chartRef"></div>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  shallowRef,
  toRefs,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  getCurrentInstance,
  nextTick,
  h,
  useAttrs,
} from "vue";
const attrs: any = useAttrs();
import * as echarts from "echarts";
// 图表容器
const chartRef = shallowRef(null);
// 图标实例
const myChart = shallowRef();
import elementResize from "element-resize-detector"; // 尺寸监听组件

import { useWindowSize, useElementSize } from "@vueuse/core";
const { width, height } = useWindowSize();
watch([width, height], (n: any) => {
  onResize();
});

const { width: chartWidth, height: chartHeight } = useElementSize(chartRef);
watch([chartWidth, chartHeight], (n: any) => {
  onResize();
});

const handleChart = () => {
  myChart.value ? myChart.value?.dispose() : null;
  myChart.value = echarts.init(
    chartRef.value,
    null,
    attrs?.initInfo,
    // ?? {
    //   renderer: 'canvas',
    //   useDirtyRect: false,
    // },
  );
  attrs?.getSeriesData?.(attrs?.data, myChart.value);
  myChart.value && attrs.option ? myChart.value?.setOption(attrs.option) : null;
  onResize();
  myChart.value?.on("legendselectchanged", (params) => {
    if (attrs?.chartEventLegendselectchanged) {
      const options = attrs?.chartEventLegendselectchanged(params);
      myChart.value && (attrs.option || options)
        ? myChart.value?.setOption(options || attrs.option)
        : null;
    }
  });
  myChart.value?.on("click", (params) => {
    if (attrs?.chartEventClick) {
      const options = attrs?.chartEventClick(params);
      myChart.value && (attrs.option || options)
        ? myChart.value?.setOption(options || attrs.option)
        : null;
    }
  });
};
const onResize = () => {
  let elementResize2 = elementResize({
    strategy: "scroll", // <- 推荐监听滚动，提升性能
    callOnAdd: true, // 添加侦听器时是否应调用,默认true
  });
  nextTick(() => {
    chartRef.value
      ? elementResize2.listenTo(chartRef.value, function (element) {
          chartRef.value ? echarts?.init(chartRef.value).resize() : null; // 当元素尺寸发生改变是会触发此事件，刷新图表
        })
      : null;
  });
};
// 初始化图表
watch(
  () => attrs.data,
  (n: any) => {
    if (n || n?.length) {
      if (chartRef.value) {
        handleChart();
      }
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
defineExpose({
  myChart,
  onResize,
});
const hasData = () => {
  if (attrs?.data != null && attrs?.data != undefined) {
    if (Array.isArray(attrs?.data)) {
      return attrs?.data?.length;
    } else if (
      Object.prototype.toString.call(attrs?.data) === "[object Object]"
    ) {
      return Object.keys(attrs?.data)?.length;
    }
  } else {
    return false;
  }
};
onMounted(() => {
  if (hasData() && chartRef.value) {
    handleChart();
  }
});
onUnmounted(() => {
  myChart.value ? myChart.value?.dispose() : null;
});
</script>

<style lang="scss" scoped>
.ChartContent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
