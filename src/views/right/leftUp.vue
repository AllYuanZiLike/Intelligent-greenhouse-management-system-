<template>
  <div class="box">
    <div ref="tem" id="tem">
      <img src="../../assets/right/tem-now.png" alt="">
      <div class="value">{{config.data}}℃</div>
    </div>
    <div class="title">
      温度
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted, reactive, ref} from "vue";

type EChartsOption = echarts.EChartsOption;
const tem = ref();
const config = reactive({
  data:20
})

const getData = (data:number)=>{
  config.data = data
}

defineExpose({
  getData
})
// onMounted(() => {
//
//   let chartDom = tem.value;
//   let myChart = (echarts).init(chartDom, 'dark');
//   console.log(myChart)
//   myChart.resize();
//   window.addEventListener('resize', () => {
//     myChart.resize()
//   })
//   let option:EChartsOption = {
//     series: [
//       {
//         type: 'gauge',
//         center: ['50%', '60%'],
//         startAngle: 200,
//         endAngle: -20,
//         min: 0,
//         max: 60,
//         splitNumber: 12,
//         itemStyle: {
//           color: '#FFAB91'
//         },
//         progress: {
//           show: true,
//           width: 15
//         },
//
//         pointer: {
//           show: false
//         },
//         axisLine: {
//           lineStyle: {
//             width: 30
//           }
//         },
//         axisTick: {
//           distance: -45,
//           splitNumber: 5,
//           lineStyle: {
//             width: 2,
//             color: '#999'
//           }
//         },
//         splitLine: {
//           distance: -52,
//           length: 14,
//           lineStyle: {
//             width: 3,
//             color: '#999'
//           }
//         },
//         axisLabel: {
//           distance: -20,
//           color: '#999',
//           fontSize: 15
//         },
//         anchor: {
//           show: false
//         },
//         title: {
//           show: true
//         },
//         detail: {
//           valueAnimation: true,
//           width: '60%',
//           lineHeight: 40,
//           borderRadius: 8,
//           offsetCenter: [0, '55%'],
//           fontSize: 15,
//           fontWeight: 'bolder',
//           formatter: '{value} °C',
//           color: 'inherit'
//         },
//         data: [
//           {
//             value: 20
//           }
//         ]
//       },
//       {
//         type: 'gauge',
//         center: ['50%', '60%'],
//         startAngle: 200,
//         endAngle: -20,
//         min: 0,
//         max: 60,
//         splitNumber: 12,
//         itemStyle: {
//           color: '#FD7347'
//         },
//         progress: {
//           show: true,
//           width: 8
//         },
//
//         pointer: {
//           show: false
//         },
//         axisLine: {
//           lineStyle: {
//             width: 30
//           }
//         },
//         axisTick: {
//           distance: -45,
//           splitNumber: 5,
//           lineStyle: {
//             width: 2,
//             color: '#999'
//           }
//         },
//         splitLine: {
//           distance: -52,
//           length: 14,
//           lineStyle: {
//             width: 3,
//             color: '#999'
//           }
//         },
//         axisLabel: {
//           distance: -20,
//           color: '#999',
//           fontSize: 15
//         },
//         anchor: {
//           show: false
//         },
//         title: {
//           show: true
//         },
//         detail: {
//           valueAnimation: true,
//           width: '60%',
//           lineHeight: 40,
//           borderRadius: 8,
//           offsetCenter: [0, '55%'],
//           fontSize: 15,
//           fontWeight: 'bolder',
//           formatter: '{value} °C',
//           color: 'inherit'
//         },
//         data: [
//           {
//             value: 20
//           }
//         ]
//       },{
//         type: 'gauge',
//         center: ['50%', '60%'],
//         startAngle: 200,
//         endAngle: -20,
//         min: 0,
//         max: 60,
//         itemStyle: {
//           color: '#FD7347'
//         },
//         progress: {
//           show: true,
//           width: 8
//         },
//
//         pointer: {
//           show: false
//         },
//         axisLine: {
//           show: false
//         },
//         axisTick: {
//           show: false
//         },
//         splitLine: {
//           show: false
//         },
//         axisLabel: {
//           show: false
//         },
//         detail: {
//           show: false
//         },
//         data: [
//           {
//             value: 20
//           }
//         ]
//       }
//     ]
//   };
//   option && myChart.setOption(option);
// })

</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  #tem {
    width: 30%;
    height: 35%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .value {
      margin-top: 1vh;
      font-size: 3vh;
      color: #b98142;
      font-weight: 1000;
    }
  }
  .title {
    width: 30%;
    height: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 10%;
    font-size: 2.2vh;
    text-align: center;
    background-color: rgba(201, 171, 146, 0.55);
    border-radius: 10px;
    box-shadow: rgba(108, 108, 166, 0.1) 0px 4px 16px, rgba(150, 113, 87, 0.74) 0px 8px 24px, rgba(17, 17, 26, 0.27) 0px 16px 56px;
  }
}
</style>
