<template>
  <el-dialog
      v-model="loginVisible"
      title="登录"
      width="25vw"
      center
      class="login"
  >
    <el-form
        ref="loginFormRef"
        style="width: 20vw;"
        :model="loginForm"
        status-icon
        :rules="loginRules"
        label-width="auto"
        class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model.number="loginForm.username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <span style="margin: 0 auto;color:#2b62a9;font-size: 1vh;cursor: pointer;" @click="loginVisible=false;registerVisible=true">暂无账号，去注册</span>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitLoginForm(loginFormRef)">登录</el-button>
        <el-button @click="loginVisible=false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="registerVisible"
      title="注册"
      width="25vw"
      center
      class="register"
  >
    <el-form
        ref="registerFormRef"
        style="width: 20vw;"
        :model="registerForm"
        status-icon
        :rules="registerRules"
        label-width="auto"
        class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model.number="registerForm.username" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.number="registerForm.phone" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input v-model="registerForm.rePassword" type="password" autocomplete="off" />
      </el-form-item>
<!--      <span style="margin: 0 auto;color:#2b62a9;font-size: 1vh;">暂无账号，去注册</span>-->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitRegisterForm(registerFormRef)">注册</el-button>
        <el-button @click="registerVisible=false;loginVisible=true;">已有账号，去登录</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import type { FormInstance, FormRules } from "element-plus";
import service from "@/axios/index"
import store from "@/store/index"
import {ElMessage} from "element-plus";

const loginVisible = ref(false);
const registerVisible = ref(false);

const init = ()=>{
  loginVisible.value = true;
}

const loginForm = reactive({
  username:"",
  password:""
})

const loginFormRef = ref<FormInstance>()
const loginRules = reactive<FormRules<typeof loginForm>>({
  username: [{ required:true, trigger: 'blur' }],
  password: [{ required:true, trigger: 'blur' }]
})

const emits = defineEmits(["getLogin"])
const isLogin = ref();
const submitLoginForm = (formEl: FormInstance | undefined)=>{
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      service.post("/login",loginForm).then(res=>{
        console.log(res)
        if(res.data.code != 200) return false
        isLogin.value = true;
        let user = {
          id:"",
          username:"",
          role: 1,
          phone:""
        }
        user.id = res.data.data.user.id
        user.username = res.data.data.user.username
        user.role = res.data.data.user.role
        user.phone = res.data.data.user.phone
        store.commit("getLogin",isLogin.value)
        store.commit("getUserInfo",user)
        window.sessionStorage.setItem("token",res.data.data.token);
        emits("getLogin",isLogin.value);
        loginVisible.value = false;
      })
    }
  })
}

const registerForm = reactive({
  username:"",
  password:"",
  phone:"",
  rePassword:""
})

const phoneValid = (rule: any, value: any, callback: any)=>{
  if (!value) {
    return callback(new Error("手机号不能为空"));
  } else {
    const reg = /^1[3456789]\d{9}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入正确的手机号"));
    }
  }7
}
const registerFormRef = ref<FormInstance>()
const registerRules = reactive<FormRules<typeof registerForm>>({
  username: [{ required:true, trigger: 'blur',message:"请输入用户名" },
{ min: 3, max: 10, message: '长度应该在3至10个字符', trigger: 'blur' }],
  password: [{ required:true, trigger: 'blur',message:"请输入密码" },
    { min: 3, max: 10, message: '长度应该在3至10个字符', trigger: 'blur' }],
  phone:[{required:true, validator:phoneValid,trigger:'blur',message:"请输入手机号"}],
  rePassword:[{ required:true, trigger: 'blur',message:"请再次输入密码" },
    { min: 3, max: 10, message: '长度应该在3至10个字符', trigger: 'blur' }]
})

const submitRegisterForm = (formEl: FormInstance | undefined)=>{
  if (!formEl) return
  if(registerForm.password!=registerForm.rePassword) {
    ElMessage.error("两次密码输入不一致！")
  }else {
    formEl.validate((valid) => {
      if (valid) {
        service.post("/register", {username:registerForm.username,password:registerForm.password,phone:registerForm.phone}).then(res=>{
          console.log(res)
          if(res.data.code != 200) return false
          registerVisible.value = false;
          loginVisible.value = true;

        })
      }
    })
  }
}

defineExpose({
  init
})
</script>

<style scoped>

</style>
