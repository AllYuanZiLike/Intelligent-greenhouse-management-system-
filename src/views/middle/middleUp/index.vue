<template>
  <div class="box">
    <div class="otherInfo">日期：{{nowTime}}</div>

    <div v-show="!greenhouse.isLogin" style="width: 100%;height: 90%;display:flex;flex-direction: row;justify-content: center;align-items: center">暂无数据</div>
    <div v-show="greenhouse.isLogin" ref="chartRef" id="chart" style="width: 100%;height: 90%;"></div>
<!--    <el-carousel :interval="5000" arrow="always">-->
<!--      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">-->
<!--       -->
<!--      </el-carousel-item>-->
<!--    </el-carousel>-->
  </div>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import * as echarts from 'echarts';
import service from "@/axios";
import dayjs from "dayjs";

//定义全局的echarts实例
let echartsInstance: echarts.EChartsType | null | undefined;
let option: echarts.EChartsOption;
const colors = ['#5470C6', '#91CC75', '#EE6666','#e79b40'];

const greenhouse = reactive({
  gid: "",
  isLogin:false
})

const data = reactive({
  co2:[],
  humidity:[],
  temperature:[],
  other:[],
  time:[] as string[]
})

const getGreenhouseId = (id:any,isLogin:boolean)=>{
  greenhouse.gid = id;
  greenhouse.isLogin = isLogin
  getHistoryData()
  console.log(222)
}
const getHistoryData = ()=>{
  console.log(greenhouse)
  service.get("/env/getEnvDatas",{params:{gid:greenhouse.gid}}).then(res=>{
    console.log(res)
    if(res.data.code != 200) return false
    let sevenDaysData:string[] = []
      for(let i=6;i>=0;i--){
        sevenDaysData[6-i] = dayjs(res.data.data.time[i]).format("HH:mm:ss");
      }
    Object.assign(data,res.data.data)
    data.time = sevenDaysData
  }).then(()=>{
    console.log(data.time)
    var chartDom = document.getElementById('chart')!;
    console.log(chartDom)
    var myChart = echarts.init(chartDom);
    echartsInstance = myChart;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      textStyle:{
        color:'#fff'
      },
      legend: {
        data: ['湿度', 'CO₂浓度', '光照强度', '温度'],
        textStyle:{
          color: '#fff'
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          interval:600000,
          type: 'category',
          data: data.time,
        }
      ],
      yAxis: [
        {
          type: 'value',
          min:45,
          max:95,
          interval:10,
          name: '湿度',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: '{value} %'
          },
          offset: 0,
        },
        {
          type: 'value',
          min:400,
          max:2400,
          interval:400,
          name: 'CO₂浓度',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          axisLabel: {
            formatter: '{value} ppm'
          },
          offset: 50,
        },
        {
          type: 'value',
          min:25000,
          max:65000,
          interval:8000,
          name: '光照强度',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[3]
            }
          },
          axisLabel: {
            formatter: '{value} lx'
          },
          offset: 120,
        },
        {
          type: 'value',
          min:-20,
          max:80,
          interval:20,
          name: '温度',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[2]
            }
          },
          axisLabel: {
            formatter: '{value} ℃'
          }
        },
      ],
      series: [
        {
          name: '湿度',
          type: 'bar',
          stack: 'Total',
          emphasis: {
            focus: 'series'
          },
          data: data.humidity,
          yAxisIndex:0
        },
        {
          name: 'CO₂浓度',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: data.co2,
          yAxisIndex:1
        },
        {
          name: '光照强度',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: data.other,
          yAxisIndex:2
        },
        {
          name: '温度',
          type: 'line',
          stack: 'Total',
          emphasis: {
            focus: 'series'
          },
          data: data.temperature,
          yAxisIndex:3
        }
      ]
    };
    option && myChart.setOption(option);
  })
}

//时钟
const nowTime = ref();
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // 设置时钟元素的内容
  nowTime.value = dayjs(new Date().getTime()).format("YYYY-MM-DD") + ` ${hours}:${minutes}:${seconds}`;
}

// 每秒更新一次时钟
setInterval(updateClock, 1000);

// 初始时更新一次时钟
updateClock();
defineExpose({
  getGreenhouseId,getHistoryData
})
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100%;
  border: 1px solid #5d6c99;
  display: flex;
  flex-direction: column;
  //background-color: #77797C84;
  .otherInfo {
    height: 10%;
    font-size: 1vh;
  }
}
</style>
