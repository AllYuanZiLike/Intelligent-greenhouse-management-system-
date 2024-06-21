<template>
  <div id="CO2" ref="CO2"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {nextTick, onMounted, ref} from "vue";
//折线图
// 声明周期函数，自动执行初始化
const CO2 = ref();
onMounted(() => {

  let chartDom = CO2.value;
  console.log(chartDom)
  let myChart = echarts.init(chartDom, 'dark');
  let option = {
    width:'85%',
    height:'100%',
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };
  option && myChart.setOption(option);
})

</script>

<style scoped lang="less">
/* 样式这里要设置长宽，不然显示不出来 */
#chart {
  width: 100%;
  height: 100%;
}
</style>
