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
import {onMounted, ref, watch} from "vue";
import {reactive} from "vue";
import dayjs from "dayjs";
import service from "@/axios";
import {ElMessage} from "element-plus";


const leftUpRef = ref();
const rightUpRef = ref();
const leftDownRef = ref()
const rightDownRef = ref()
const data = reactive({
  id:null,
  gid: "",
  time: "2024-06-27 17:36:03",
  temperature: 26,
  humidity: 72,
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

const configData = reactive({
  temperatureMin:0,
  temperatureMax:0,
  humidityMin:0,
  humidityMax:0,
  co2Min:0,
  co2Max:0,
  otherMin:0,
  otherMax:0
})
const getControlData = ()=>{
  service.get("/con/getPages",{params:{gid:data.gid,pageNum:1,pageSize:20}}).then(res=>{
    console.log(res)
    if(res.data.cpde!=200) return false
    for(let i=0;i<res.data.data.list.length;i++){
      if(res.data.data.list[i].parameter==0) {
        configData.temperatureMin = res.data.data.list[i].min
        configData.temperatureMax = res.data.data.list[i].max
      } else if(res.data.data.list[i].parameter==1) {
        configData.humidityMin = res.data.data.list[i].min
        configData.humidityMax = res.data.data.list[i].max
      } else if(res.data.data.list[i].parameter==2) {
        configData.co2Min = res.data.data.list[i].min
        configData.co2Max = res.data.data.list[i].max
      } else if(res.data.data.list[i].parameter==3) {
        configData.otherMin = res.data.data.list[i].min
        configData.otherMax = res.data.data.list[i].max
      }
    }
    console.log(configData)
  })
}

const addEvenData = ()=>{
  console.log(data)
  service.post("/env/addEnv",data).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false
    getEveInfo();
    getControlData()
    if(data.temperature>configData.temperatureMax) {
      ElMessage.error({message:"温度过高",duration:10000});

      let deviceNum = 1;
      if(data.temperature-configData.temperatureMax==20) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:0, value:data.temperature, actionTaken:`启动${deviceNum}台降温机器`}).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:1,status:"运行中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
    if(data.temperature<configData.temperatureMax) {
      ElMessage.error({message:"温度过低",duration:10000});
      let deviceNum = 1;
      if(configData.temperatureMin-data.temperature==20) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:0, value:data.temperature, actionTaken:`启动${deviceNum}台j加热机器`},).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:0,status:"运行中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
    if(data.humidity>configData.humidityMax) {
      ElMessage.error({message:"湿度过高",duration:10000});
      let deviceNum = 1;
      if(data.humidity-configData.humidityMax==20) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:1, value:data.humidity, actionTaken:`启动${deviceNum}台除湿机器`}).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:2,status:"运行中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
    if(data.humidity<configData.humidityMax) {
      ElMessage.error({message:"湿度过低",duration:10000});
      let deviceNum = 1;
      if(configData.humidityMin-data.humidity==20) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:1, value:data.humidity, actionTaken:`启动${deviceNum}台加湿机器`}).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:3,status:"运行中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
    if(data.co2>configData.co2Max) {
      ElMessage.error({message:"CO₂浓度过高",duration:10000});
      let deviceNum = 1;
      if(data.humidity-configData.humidityMax==300) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:2, value:data.co2, actionTaken:`启动${deviceNum}台通风机器`}).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:4,status:"运行中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
    if(data.co2<configData.co2Max) {
      ElMessage.error({message:"CO₂浓度过低",duration:10000});
      let deviceNum = 1;
      if(configData.co2Min-data.co2==300) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:2, value:data.co2, actionTaken:`启动${deviceNum}台通风机器`}).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:4,status:"运行中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
    if(parseInt(data.other)>configData.otherMax) {
      ElMessage.error({message:"光照过强",duration:10000});
      let deviceNum = 1;
      if(parseInt(data.other)-configData.otherMax==30000) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:3, value:data.other, actionTaken:`关闭${deviceNum}台光照机器`}).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:5,status:"空闲中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
    if(parseInt(data.other)<configData.otherMin) {
      ElMessage.error({message:"光照强度过低",duration:10000});
      let deviceNum = 1;
      if(configData.otherMin-parseInt(data.other)==30000) deviceNum=3;
      service.post("/al/addAl",{gid:data.gid, time: data.time, parameter:3, value:data.other, actionTaken:`启动${deviceNum}台光照机器`}).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
      let deviceData = [];
      for(let i=0;i<deviceNum;i++){
        deviceData.push({gid:data.gid,type:5,status:"运行中"})
      }
      service.post("/dev/control",deviceData).then(res=>{
        console.log(res)
        if(res.data.code!=200) return false
      })
    }
  })

}

const emits = defineEmits(['newDataCreated'])

const createRandomData = ()=>{
  setInterval(()=>{
    console.log("生成数据啦啦啦啦啦");
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const temRandom = getRandomInt(-10,60);
    const humidityRandom = getRandomInt(45,95);
    const CO2Random = getRandomInt(600,2000);
    const otherRandom = getRandomInt(25000,65000);

    data.time = time;
    data.temperature = temRandom;
    data.humidity = humidityRandom;
    data.co2 = CO2Random;
    data.other = otherRandom.toString();

    addEvenData()
    console.log(111)
    emits('newDataCreated')
  },600000)
}
const isLogin = ref(false)
const getGreenhouseId = (id:string,login:boolean)=>{
  data.gid = id
  isLogin.value = login
  console.log(id)
  console.log("生成数据", isLogin.value)
  if (isLogin.value) {
    createRandomData();
  }
}
onMounted(()=> {
  // getEveInfo()

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
