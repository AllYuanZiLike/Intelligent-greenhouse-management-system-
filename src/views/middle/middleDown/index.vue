<template>
  <div class="box">
    <div class="heater device">
      <div class="img">
        <img src="../../../assets/middle/heater.png" alt="">
      </div>
      <div class="type">加热器</div>
    </div>
    <div class="cooling device">
      <div class="img">
        <img src="../../../assets/middle/cooling.png" alt="">
      </div>
      <div class="type">降温器</div>
    </div>
    <div class="humidity device">
      <div class="img">
        <img src="../../../assets/middle/humidity.png" alt="">
      </div>
      <div class="type">湿度控制器</div>
    </div>
    <div class="watering device">
      <div class="img">
        <img src="../../../assets/middle/watering.png" alt="">
      </div>
      <div class="type">灌溉设备</div>
    </div>
    <div class="ventilate device">
      <div class="img">
        <img src="../../../assets/middle/ventilate.png" alt="">
      </div>
      <div class="type">通风设备</div>
    </div>
    <div class="fertilize device">
      <div class="img">
        <img src="../../../assets/middle/fertilize.png" alt="">
      </div>
      <div class="type">施肥设备</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const type = reactive([
    {value:0,label:"加热器"},
    {value:1,label:"降温设备"},
    {value:2,label:"湿度控制器"},
    {value:3,label:"灌溉设备"},
    {value:4,label:"通风设备"},
    {value:5,label:"施肥设备"},
])
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
