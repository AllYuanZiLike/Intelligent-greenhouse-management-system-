<template>
  <el-drawer
      v-model="visibleDrawer"
      direction="rtl"
      size="40%"
      :with-header="false"
  >
    <div class="box">

      <div class="btn-box">
        <div class="title">调控策略</div>
      </div>
      <div class="form-box">
        <el-form
            ref="dataFormRef"
            :model="dataForm"
            :rules="dataFormRules"
            label-width="auto"
            status-icon
        >
          <el-form-item label="温度最小值" prop="temperatureMin">
            <el-select v-model="dataForm.temperatureMin" filterable allow-create default-first-option
                :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="温度最大值" prop="temperatureMin">
            <el-select v-model="dataForm.temperatureMin" filterable allow-create default-first-option
                       :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="湿度最小值" prop="humidityMin">
            <el-select v-model="dataForm.humidityMin" filterable allow-create default-first-option
                       :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="湿度最大值" prop="humidityMax">
            <el-select v-model="dataForm.humidityMax" filterable allow-create default-first-option
                       :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="CO₂浓度最小值" prop="co2Min">
            <el-select v-model="dataForm.co2Min" filterable allow-create default-first-option
                       :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="CO₂浓度最大值" prop="co2Max">
            <el-select v-model="dataForm.co2Max" filterable allow-create default-first-option
                       :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="光照强度最小值" prop="otherMin">
            <el-select v-model="dataForm.otherMin" filterable allow-create default-first-option
                       :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="光照强度最大值" prop="otherMax">
            <el-select v-model="dataForm.otherMax" filterable allow-create default-first-option
                       :reserve-keyword="false" placeholder="请选择或者输入新值">
              <el-option v-for="item in configList" :key="item.value" :label="`${item.key}:${item.value}`" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitDataForm(dataFormRef)">保存</el-button>
            <el-button @click="visibleDrawer=false">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import { Search } from '@element-plus/icons-vue'
import service from "@/axios";
import store from "@/store";
import {ElMessage, FormInstance, FormRules} from "element-plus";

const configList = reactive([])
const getConfigList = ()=>{

}
const greenhouse = reactive({
  gid: "",
  isLogin:false
})
const isLogin = ref(false)
const getGreenhouseId = (id:string,login:boolean)=>{
  greenhouse.gid = id
  isLogin.value = login
  console.log(id)
}
const visibleDrawer = ref(false)
const init = ()=>{
  visibleDrawer.value = true;
}

const dialogVisible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
  id:"",
  uid:"",
  temperatureMin:0,
  temperatureMax:0,
  humidityMin:0,
  humidityMax:0,
  co2Min:0,
  co2Max:0,
  otherMin:0,
  otherMax:0
})

const dataFormRules = reactive<FormRules<typeof dataForm>>({
  temperatureMin: [{ required:true, trigger: 'blur' }],
  temperatureMax: [{ required:true, trigger: 'blur' }],
  humidityMin: [{ required:true, trigger: 'blur' }],
  humidityMax: [{ required:true, trigger: 'blur' }],
  co2Min: [{ required:true, trigger: 'blur' }],
  co2Max: [{ required:true, trigger: 'blur' }],
  otherMin: [{ required:true, trigger: 'blur' }],
  otherMax: [{ required:true, trigger: 'blur' }]
})


const submitDataForm = (formEl: FormInstance | undefined)=>{
  dataForm.uid = store.state.userInfo.id
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(dataForm)
      service.post("/greenHouse/addGreenHouse",dataForm).then(res=>{
                console.log(res)
                if(res.data.code != 200) return false
                ElMessage.success(res.data.msg)
                dialogVisible.value = false;
              })
    }
  })
}

defineExpose({
  init,getGreenhouseId
})
</script>

<style scoped lang="less">
.el-drawer.ltr{
  background-color: transparent;
  //background-color: rgba(31, 66, 140, 0.56);
  .box{
    height: 100%;
    background-color: #c6cbff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 5%;
    border:2px double #6a83ff;
    .btn-box {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 10%;
      .title {
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: #fff;
        font-size: 2vh;
      }
    }
    .table-box {
      height: 80%;
      background-color: #fff;
    }
  }
}
</style>
