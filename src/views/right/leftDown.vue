<template>
  <div class="box">
    <div id="left-down">
      <img src="../../assets/right/co2-now.png" alt="">
      <div class="value">{{config.data}}ppm</div>
    </div>
    <div class="title">
      CO₂浓度
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const config = reactive({
  data:20
});
const getData = (data:number)=>{
  config.data = data
}

defineExpose({
  getData
})
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  #left-down {
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
      color:#42b983;
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
    background-color: rgba(146, 201, 149, 0.55);
    border-radius: 10px;
    box-shadow: rgba(108, 108, 166, 0.1) 0px 4px 16px, rgba(89, 150, 87, 0.74) 0px 8px 24px, rgba(17, 17, 26, 0.27) 0px 16px 56px;
  }
}
</style>
