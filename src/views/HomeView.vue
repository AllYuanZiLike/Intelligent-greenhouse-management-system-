<template>
    <div class="home">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <dv-border-box-11 title="智能温室管理系统" class="border" v-if="!loading">
        <div class="main">
        <div class="left">
          <div class="left-up">
<!--              <el-button class="my-btn" plain>个人主页</el-button>-->
              <div class="my-btn" @click="openMyHome()"  v-show="isLogin">
                <img src="../assets/person.png" alt="">
                <div class="username">{{store.state.userInfo.username}}</div>
              </div>
              <el-button class="login-btn" plain @click="openLogin()" v-show="!isLogin">登录</el-button>
              <dv-decoration-4 :reverse="true" class="left-up-bottom-b" />

          </div>
          <div class="left-center">
            <div class="greenhouse" v-show="isLogin">
              <dv-decoration-11 class="name">{{greenhouseInfo.name}}</dv-decoration-11>
<!--              <div></div>-->
              <div class="location">
                <div class="img">
                  <img src="../assets/left/location.png" alt="">
                </div>
                <div class="text">{{greenhouseInfo.location}}</div>
              </div>
            </div>
            <div class="btn-box">
              <el-button class="btn" plain @click="openSystemConfig()" :disabled="!isLogin" :icon="Setting">设置</el-button>
              <el-button class="btn" plain @click="openGreenhouse()" :disabled="!isLogin"  :icon="Switch">切换</el-button>
              <el-button class="btn" plain @click="getRefresh()" :disabled="!isLogin"  :icon="Refresh">刷新</el-button>
            </div>
          </div>
          <div class="left-down">
            <dv-border-box-12 class="border" style="margin-bottom: 2vh">
              <el-button class="warning-btn" plain @click="openControl()" :disabled="!isLogin">调控策略</el-button>
            </dv-border-box-12>
            <dv-border-box-12 class="border">
              <el-button class="warning-btn" plain @click="openAlarm()" :disabled="!isLogin">报警记录</el-button>
            </dv-border-box-12>

          </div>
        </div>
        <div class="middle">
          <dv-border-box-7 class="middle-up">
            <MiddleUp ref="middleUpRef"></MiddleUp>
          </dv-border-box-7>
          <div class="middle-down">
            <dv-border-box-5 class="border-box">
              <MiddleDown ref="middleDownRef"></MiddleDown>
            </dv-border-box-5>
          </div>
        </div>
        <div class="right">
          <dv-border-box-8 class="right-down">
            <Right ref="rightRef" @newDataCreated="getNewEveData"></Right>
          </dv-border-box-8>
        </div>
      </div>
      </dv-border-box-11>
    </div>

  <Login ref="loginRef" @getLogin="getLogin"></Login>
  <MyHome ref="myHomeRef" @afterExit="getLogin"></MyHome>
  <SystemConfig ref="systemConfigRef"></SystemConfig>
  <Greenhouse ref="greenhouseRef" @switchGreenhouse="getGreenhouseById"></Greenhouse>
  <Alarm ref="alarmRef"></Alarm>
  <Control ref="controlRef"></Control>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue";
import { Setting,Switch,Refresh} from '@element-plus/icons-vue'
import Login from '@/views/login.vue'
import MyHome from '@/views/userPage/myHome.vue'
import SystemConfig from '@/views/left/systemConfig.vue'
import Greenhouse from '@/views/left/greenhouse.vue'
import Alarm from '@/views/left/alarm.vue'
import Control from "@/views/left/control.vue"
import MiddleUp from '@/views/middle/middleUp/index.vue'
import MiddleDown from '@/views/middle/middleDown/index.vue'
import Right from '@/views/right/index.vue'
import store from "@/store/index"

onMounted(()=>{
  cancelLoading();
  isLogin.value = store.state.isLogin
  // getGreenhouseInfo()
})

const loading = ref(true);
const cancelLoading = ()=> {
  setTimeout(() => {
    loading.value = false
  }, 500)
}


const isLogin = ref(false);
const getLogin = (e:boolean)=>{
  isLogin.value = store.state.isLogin;
  console.log(isLogin.value)
  // getRefresh()
  // getGreenhouseInfo()
  let noGreenInfo = {
    id:"",
    al: null,
    con: null,
    description: "暂无信息",
    dev: null,
    env: null,
    location: "暂无信息",
    name:"暂无信息",
    uid:""
  }
  Object.assign(greenhouseInfo,noGreenInfo)
}

const loginRef = ref();
const openLogin = ()=>{
  nextTick(()=>{
    loginRef.value.init();
  })
}

const myHomeRef = ref();
const openMyHome = ()=>{
  nextTick(()=>{
    myHomeRef.value.init();
  })
}

const systemConfigRef = ref()
const openSystemConfig = ()=>{
  nextTick(()=>{
    systemConfigRef.value.init()
  })
}

const greenhouseRef = ref()
const openGreenhouse = ()=>{
  greenhouseRef.value.init()
}

const alarmRef = ref()
const openAlarm = ()=>{
  alarmRef.value.init();
}

const controlRef = ref()
const openControl = ()=>{
  controlRef.value.init();
}

const greenhouseInfo = reactive({
  id:"",
  al: null,
  con: null,
  description: "暂无信息",
  dev: null,
  env: null,
  location: "暂无信息",
  name:"暂无信息",
  uid:1
})


const getGreenhouseInfo = ()=>{
  service.get("/greenHouse/getOne",{params:{uid:store.state.userInfo.id}}).then(res=>{
    console.log(res)
    if(res.data.code != 200) return false
    Object.assign(greenhouseInfo,res.data.data)
    rightRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    middleUpRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    controlRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    alarmRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    middleDownRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)

  })
}

const getGreenhouseById = (id:any)=>{
  service.get("/greenHouse/getById",{params: {id: id}}).then(res=>{
    console.log(res)
    if(res.data.code != 200) return false
    Object.assign(greenhouseInfo,res.data.data)
    rightRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    middleUpRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    controlRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    alarmRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
    middleDownRef.value.getGreenhouseId(greenhouseInfo.id,isLogin.value)
  })
}

const middleDownRef = ref()
const middleUpRef = ref()
const rightRef = ref();
const getRefresh = ()=>{
  getGreenhouseInfo();
  rightRef.value.getEveInfo();
  middleUpRef.value.getHistoryData();
}

const getNewEveData = ()=>{
  console.log(333)
  middleUpRef.value.getHistoryData();
}
import { debounce } from "lodash";
import service from "@/axios";
const resizeObserver  = (window as any).ResizeObserver;
(window as any).ResizeObserver = class ResizeObserver extends resizeObserver  {
  constructor(callback: (...args: any[]) => void) {
    callback = debounce(callback, 100);
    super(callback);
  }
};

</script>

<style scoped lang="less">

.home {
    color: #fff;
    font-size: 2vw;
    width: 100%; /* 视口宽度 */
    height: 100%;
    //overflow: hidden;
    background-image: url('../assets/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 1vh blue;
    .border {
      //height: 100%;
      //width: 100%;
      .main {
        height: 86%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 10vh 3.5vw 0 1vw;
        .left {
          width: 10%;
          height: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .left-up {
            height: 10%;
            width: 85%;
            .left-up-bottom-b {
              width: 100%;
              height: 1vh;
            }
            .my-btn {
              width: 100%;
              height: 50%;
              color: #ffffff;
              background-color: #2c31;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              img {
                height: 80%;
              }
              .username {
                width: 55%;
                font-size: 1.5vh;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin: 0 5%;
              }
            }
            .login-btn {
              width: 80%;
              height: 70%;
              color: #467ccb;
              background-color: #2c31;
              border: none;
            }
          }
          .left-center {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 70%;
            width: 100%;
            .greenhouse {
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              height: 40%;
              width: 100%;
              .name {
                width: 100%;
                height: 8vh;
                font-size: 2vh;
              }
              .location {
                width: 100%;
                height: 35%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                .img {
                  height: 65%;
                  width: 35%;
                  img {
                    height: 100%;
                  }
                }
                .text {
                  font-size: 2vh;
                }
              }
            }
            .btn-box {
              height: 60%;
              width: 100%;
              .btn {
                width: 80%;
                height: 15%;
                margin: 3vh 0;
                color: #ffffff;
                background-color: #2c31;
              }
            }
          }
          .left-down {
            height: 30%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            .border {
              width: 85%;
              height: 25%;
              .warning-btn {
                width: 100%;
                height: 100%;
                color: #ffffff;
                background-color: #2c31;
                border: none;
              }
            }

          }
        }
        .middle {
          width: 45%;
          height: 100%;
          display: flex;
          flex-direction: column;

          .middle-up {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 50%;
          }

          .middle-down {
            height: 45%;
            margin-top: 5%;
            display: flex;
            justify-content: center;
            .border-box {
              //border: 1px solid #5d6c99;
            }
          }
        }
        .right {
          width: 35%;
          height: 100%;
          .right-down {
            height: 100%;
            width: 100%;
          }
        }

      }
    }
  }

</style>
