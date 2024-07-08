<template>
  <div class="box">
    <dv-water-level-pond :config="config" id="right-up"/>
    <div class="title">
      湿度
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from "vue";

const config = reactive({
  data:[66]
});
const getData = (data:number)=>{
  config.data[0] = data
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
  justify-content: space-around;
  align-items: center;
  #right-up {
    width: 50%;
    height: 32%;
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
    background-color: rgba(146, 163, 201, 0.55);
    border-radius: 10px;
    box-shadow: rgba(108, 108, 166, 0.1) 0px 4px 16px, rgba(87, 87, 150, 0.74) 0px 8px 24px, rgba(17, 17, 26, 0.27) 0px 16px 56px;
  }
}
</style>
