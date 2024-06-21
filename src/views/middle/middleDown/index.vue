<template>
  <div class="box">
    <div class="heater device" @click="openHeater">
      <div class="img">
        <img src="../../../assets/middle/heater.png" alt="">
      </div>
      <div class="type">加热器</div>
    </div>
    <div class="cooling device" @click="openCooling">
      <div class="img">
        <img src="../../../assets/middle/cooling.png" alt="">
      </div>
      <div class="type">降温器</div>
    </div>
    <div class="humidity device" @click="openHumidity">
      <div class="img">
        <img src="../../../assets/middle/humidity.png" alt="">
      </div>
      <div class="type">湿度控制器</div>
    </div>
    <div class="watering device" @click="openWatering">
      <div class="img">
        <img src="../../../assets/middle/watering.png" alt="">
      </div>
      <div class="type">灌溉设备</div>
    </div>
    <div class="ventilate device" @click="openVentilate">
      <div class="img">
        <img src="../../../assets/middle/ventilate.png" alt="">
      </div>
      <div class="type">通风设备</div>
    </div>
    <div class="fertilize device" @click="openFertilize">
      <div class="img">
        <img src="../../../assets/middle/fertilize.png" alt="">
      </div>
      <div class="type">施肥设备</div>
    </div>
  </div>
  <Heater ref="heaterRef"></Heater>
  <Cooling ref="coolingRef"></Cooling>
  <Humidity ref="humidityRef"></Humidity>
  <ventilate ref="ventilateRef"></ventilate>
  <Watering ref="wateringRef"></Watering>
  <Fertilize ref="fertilizeRef"></Fertilize>
</template>

<script setup lang="ts">
import {nextTick, reactive, ref} from "vue";
import Heater from "@/views/middle/middleDown/haeter.vue"
import Cooling from "@/views/middle/middleDown/cooling.vue"
import Humidity from "@/views/middle/middleDown/humidity.vue"
import Ventilate from "@/views/middle/middleDown/ventilate.vue";
import Watering from "@/views/middle/middleDown/watering.vue";
import Fertilize from "@/views/middle/middleDown/fertilize.vue";

const type = reactive([
    {value:0,label:"加热器"},
    {value:1,label:"降温设备"},
    {value:2,label:"湿度控制器"},
    {value:3,label:"灌溉设备"},
    {value:4,label:"通风设备"},
    {value:5,label:"施肥设备"},
])

const heaterRef = ref()
const openHeater = ()=>{
  nextTick(()=>{

    heaterRef.value.init()
  })
}

const coolingRef = ref()
const openCooling = ()=>{
  nextTick(()=>{

    coolingRef.value.init()
  })
}
const humidityRef = ref()
const openHumidity= ()=>{
  nextTick(()=>{

    humidityRef.value.init()
  })
}
const ventilateRef = ref()
const openVentilate = ()=>{
  nextTick(()=>{

    ventilateRef.value.init()
  })
}
const fertilizeRef = ref()
const openFertilize = ()=>{
  nextTick(()=>{

    fertilizeRef.value.init()
  })
}
const wateringRef = ref()
const openWatering = ()=>{
  nextTick(()=>{
    wateringRef.value.init()
  })
}

const greenhouse = reactive({
  gid: "1",
  isLogin:false
})
const isLogin = ref(false)
const getGreenhouseId = (id:string,login:boolean)=>{
  greenhouse.gid = id
  isLogin.value = login
  console.log(id)
  heaterRef.value.getGreenhouseId(id,login)
  coolingRef.value.getGreenhouseId(id,login)
  humidityRef.value.getGreenhouseId(id,login)
  ventilateRef.value.getGreenhouseId(id,login)
  wateringRef.value.getGreenhouseId(id,login)
  fertilizeRef.value.getGreenhouseId(id,login)
}

defineExpose({
  getGreenhouseId
})
</script>

<style scoped lang="less">
.box {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 1vh 1vw;
  .device {
    width: 25%;
    height: 30%;
    margin-right: 1vw;
    margin-bottom: 2vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(94, 94, 217, 0.2) 0px 7px 29px 0px;
    background-color: transparent;
    border-radius: 1vh;
    cursor: pointer;
    .img {
      flex: 1;
      height: 40%;
      img {
        width: 70%;
      }
    }
    .type {
      flex: 2;
      font-size: 2.5vh;
      text-align: center;
    }
  }
  .device:nth-child(3n){
    margin-right: 0;
  }
}
</style>
