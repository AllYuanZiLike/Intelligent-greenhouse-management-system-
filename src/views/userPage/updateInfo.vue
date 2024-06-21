<template>
  <el-dialog v-model="dialogVisible" title="修改个人信息" width="500">
    <el-form :model="userInfo" :rules="updateRules" ref="userInfoRef">
      <el-form-item label="用户名" label-width="5vw">
        <el-input v-model="userInfo.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="昵称" label-width="5vw">
        <el-input v-model="userInfo.nickName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" label-width="5vw">
        <el-input v-model="userInfo.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" label-width="5vw">
        <el-input v-model="userInfo.password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" label-width="5vw">
        <el-input v-model="userInfo.repassword" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFromInfo">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>

import {reactive, ref} from "vue";
import service from "@/axios";
import store from "@/store";
import {ElMessage} from "element-plus";

const dialogVisible = ref(false);

const roleText = reactive([
  {value:0,label:"管理员"},
  {value:1,label:"普通用户"},
])
const userInfoRef = ref();
const userInfo = reactive({
  id:'',
  username:'',
  password:'',
  repassword:'',
  phone:'',
  role:1
})
const initDialog = ()=>{
  service.put(`/user/updateUser`,userInfo).then(res=>{
    console.log(res)
    if(res.data.code != 200) return false
    Object.assign(userInfo,res.data.data)
    userInfo.password = ""
    dialogVisible.value = true;
  })
}
const validatePhone = (rule, value, callback) => {
  if (value && !(/^1[3-9]\d{9}$/.test(value))) {
    return callback();
  }
  callback();
};
const updateRules = ref({
  username:[{required:true,message: '请输入账号',trigger:'blur'},],
  phone:[{validator:validatePhone,message: '请输入手机号',trigger:'blur'},],
  password:[{required:true,message: '请输入密码',trigger:'blur'},],
  repassword:[{required:true,message:'请再次输入密码',trigger:'blur'},],
})

const emit = defineEmits(['getUserInfo'])
const submitFromInfo = ()=>{
  if (userInfo.password !== userInfo.repassword) ElMessage.error('两次输入密码不一致，请重新输入')
  else {
    userInfoRef.value.validate((valid) => {
      if (!valid) {
        return false
      }
      service.put('/user/updateUser', userInfo).then(res => {
        console.log(res)
        if(res.data.code != 200) return ElMessage.error(res.data.message)
        ElMessage.success('修改成功');
        dialogVisible.value = false;
        emit('getUserInfo')
      })
    })
  }
}

defineExpose({
  initDialog
})
</script>

<style scoped>

</style>
