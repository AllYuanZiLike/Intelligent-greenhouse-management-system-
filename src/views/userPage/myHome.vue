<template>
  <el-drawer
      v-model="drawer"
      title="个人主页"
      direction="ltr"
      :with-header="false"
  >
    <div class="box">
      <div class="img">
        <img src="@/assets/personal-bg.png" alt="">
      </div>
      <div class="info">
        <div class="username info-item">
          <div class="text">用户名：</div>
          <div class="content">{{userInfo.username}}</div>
        </div>
        <div class="nickname info-item">
          <div class="text">身 份：</div>
          <div class="content">{{userInfo.role==0?"管理员":"普通用户"}}</div>
        </div>
        <div class="phone info-item">
          <div class="text">手机号：</div>
          <div class="content">{{userInfo.phone}}</div>
        </div>
      </div>
      <div class="btn-box">
        <el-button class="update-btn" @click="exit()">退出</el-button>
      </div>
    </div>
  </el-drawer>
  <updateInfoDialog ref="updateInfoRef" @getUserInfo="getUserInfo"></updateInfoDialog>
</template>

<script setup>
import {nextTick, reactive, ref} from "vue";
import service from "@/axios";
import store from "@/store/index";
import updateInfoDialog from "@/views/userPage/updateInfo"
import router from "@/router";

const drawer = ref(false)
const userInfo = reactive({
  id:'',
  username:'',
  password:'',
  phone:'',
})
const init = ()=>{
  drawer.value = true;
  getUserInfo();
}
const getUserInfo = ()=>{
  // service.get(`/foster/user/getUserById/${store.state.user.id}`).then(res=>{
  //   console.log(res)
  //   if(res.data.code != 200) return false
  //   Object.assign(userInfo,res.data.data)
  // })
  Object.assign(userInfo,store.state.userInfo)
}
const emits = defineEmits(['afterExit'])
const exit = ()=>{
  let user = {
    id:"",
    username:"",
    role: 2,
    phone:""
  }
  store.commit("getLogin",false);
  store.commit("getUserInfo",user);
  window.sessionStorage.removeItem("token");
  router.push("/");
  drawer.value = false;
  emits("afterExit");
}


defineExpose({
  init
})
</script>

<style lang="less">
.el-drawer.ltr{
  background-color: transparent !important;
  .el-drawer__body {
    padding: 2vh 1vw;
    //background-color: rgba(31, 66, 140, 0.56);
    .box {
      height: 100%;
      background-color: #c6cbff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      border-radius: 5%;
      border:2px double #6a83ff;
      .img {
        width: 100%;
        overflow: hidden;
        height: 20%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        img {
          height: 100%;
        }
      }
      .info {
        padding: 3vh 5vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        .info-item{
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          margin: 2vh 0;
          .text {
            font-weight: 600;
          }
        }
      }
      .btn-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 10%;
        .update-btn {
          width: 30%;
          height: 70%;
          background-color: #6a6cff;
          color:#fff;
          font-size: 2vh;
        }
      }
    }
  }
}

</style>
