<template>
  <div class="box">
    <div class="up">
      <div class="left">
        <LeftUp ref="leftUpRef"></LeftUp>
      </div>
      <div class="right">
        <RightUp ref="rightUpRef"></RightUp>
      </div>
    </div>
    <div class="down">
      <div class="left">
        <LeftDown ref="leftDownRef"></LeftDown>
      </div>
      <div class="right">
        <RightDown ref="rightDownRef"></RightDown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftUp from "@/views/right/leftUp.vue"
import LeftDown from "@/views/right/leftDown.vue"
import RightUp from "@/views/right/rightUp.vue"
import RightDown from "@/views/right/rightDown.vue"
import {onMounted, ref} from "vue";
import {reactive} from "vue";
import dayjs from "dayjs";
import service from "@/axios";


const leftUpRef = ref();
const rightUpRef = ref();
const leftDownRef = ref()
const rightDownRef = ref()
const data = reactive({
  id:null,
  gid: "",
  time: "2024-06-27 17:36:03",
  temperature: 26,
  humidity: 121,
  co2: 1234,
  other: "123"
})

const getEveInfo = ()=>{
  service.get("/env/getLatest",{params:{gid:data.gid}}).then(res=>{
    console.log(res);
    if(res.data.code!=200) return false;
    Object.assign(data,res.data.data)
    leftUpRef.value.getData(data.temperature)
    rightUpRef.value.getData(data.humidity)
    leftDownRef.value.getData(data.co2)
    rightDownRef.value.getData(Number(data.other))
  })
}

const getRandomInt = (min:number, max:number)=> {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addEvenData = ()=>{
  console.log(data)
  service.post("/env/addEnv",data).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false
    getEveInfo();
  })
}

const emits = defineEmits(['newDataCreated'])

const createRandomData = ()=>{
  setInterval(()=>{
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const temRandom = getRandomInt(-10,60);
    const humidityRandom = getRandomInt(40,85);
    const CO2Random = getRandomInt(600,2000);
    const otherRandom = getRandomInt(25000,65000);

    data.time = time;
    data.temperature = temRandom;
    data.humidity = humidityRandom;
    data.co2 = CO2Random;
    data.other = otherRandom.toString();

    addEvenData()
    emits('newDataCreated')
  },600000)
}
const isLogin = ref(false)
const getGreenhouseId = (id:string,login:boolean)=>{
  data.gid = id
  isLogin.value = login
  console.log(id)
}
onMounted(()=>{
  // getEveInfo()
  if(isLogin.value){
    createRandomData();
  }

})

defineExpose({
  getEveInfo,getGreenhouseId
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
  .up,.down {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50%;
    .left {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .right {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
