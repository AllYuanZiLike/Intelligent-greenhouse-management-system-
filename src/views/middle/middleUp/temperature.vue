<template>
  <div id="temperature" ref="temperature"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {nextTick, onMounted, ref} from "vue";
//折线图

const temperature = ref();
onMounted(() => {

  let chartDom = temperature.value;
  console.log(temperature.value)
  console.log(chartDom)
  let myChart = echarts.init(chartDom, 'dark');
  console.log(myChart)
  myChart.resize();
  window.addEventListener('resize', () => {
    myChart.resize()
  })
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
#temperature {
  width: 100%;
  height: 100%;
}
</style>
