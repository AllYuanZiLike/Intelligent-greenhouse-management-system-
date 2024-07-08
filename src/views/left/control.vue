<template>
  <el-drawer
      class="control"
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
            <el-select v-model="dataForm.temperatureMax" filterable allow-create default-first-option
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
          <el-form-item class="editbtns">
            <el-button class="savebtn" type="primary" @click="submitDataForm(dataFormRef)">保存</el-button>
            <el-button class="cancelbtn" @click="visibleDrawer=false">关闭</el-button>
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


const getDataForm = ()=>{
  console.log(greenhouse.gid)
  service.get("/con/getPages",{params:{gid:greenhouse.gid,pageNum:1,pageSize:100}}).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false
    let data = res.data.data.list;
    for(let i=0;i<data.length;i++){
      if(data[i].gid == greenhouse.gid) {
        if(data[i].parameter == 0) {
          dataForm.idTem = data[i].id;
          dataForm.temperatureMax = data[i].max;
          dataForm.temperatureMin = data[i].min;
        }
        if(data[i].parameter == 1) {
          dataForm.idHudi = data[i].id;
          dataForm.humidityMax = data[i].max;
          dataForm.humidityMin = data[i].min;
        }
        if(data[i].parameter == 2) {
          dataForm.idCO2 = data[i].id;
          dataForm.co2Max = data[i].max;
          dataForm.co2Min = data[i].min;
        }
        if(data[i].parameter == 3) {
          dataForm.idOther = data[i].id;
          dataForm.otherMax = data[i].max;
          dataForm.otherMin = data[i].min;
        }
      }
    }
  })
}

const configList = reactive([])
const getConfigList = ()=>{
  service.get("/sys/getByUid",{params:{uid:store.state.userInfo.id}}).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false

    Object.assign(configList,res.data.data);
  })
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
  getConfigList();
  getDataForm()
}

const dialogVisible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
  idTem:"",
  idHudi:"",
  idCO2:"",
  idOther:"",
  uid:"",
  temperatureMin:0,
  temperatureMax:0,
  humidityMin:0,
  humidityMax:0,
  co2Min:0,
  co2Max:0,
  otherMin:0,
  otherMax:0,
  // temperatureMinAction:"",
  // temperatureMaxAction:"",
  // humidityMinAction:"",
  // humidityMaxAction:"",
  // co2MinAction:"",
  // co2MaxAction:"",
  // otherMinAction:"",
  // otherMaxAction:""
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
  console.log(greenhouse.gid)
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(dataForm)
      service.put("/con/updateCon", {id:dataForm.idTem,gid:greenhouse.gid,parameter:"0",min:dataForm.temperatureMin,max:dataForm.temperatureMax,action:""}).then(res=>{
                console.log(res)
                if(res.data.code != 200) return false
              })
      service.put("/con/updateCon", {id:dataForm.idHudi,gid:greenhouse.gid,parameter:"1",min:dataForm.humidityMin,max:dataForm.humidityMax,action:""}).then(res=>{
        console.log(res)
        if(res.data.code != 200) return false
      })
      service.put("/con/updateCon", {id:dataForm.idOther,gid:greenhouse.gid,parameter:"3",min:dataForm.otherMin,max:dataForm.otherMax,action:""}).then(res=>{
        console.log(res)
        if(res.data.code != 200) return false
      })
      service.put("/con/updateCon", {id:dataForm.idCO2,gid:greenhouse.gid,parameter:"2",min:dataForm.co2Min,max:dataForm.co2Max,action:""}).then(res=>{
        console.log(res)
        if(res.data.code != 200) return false
        ElMessage.success("保存成功")
      }).then(()=>{
        visibleDrawer.value = false;
      })
    }

  })
}

defineExpose({
  init,getGreenhouseId
})
</script>

<style lang="less">
.control{
  background-color: transparent !important;

  .el-drawer__body {
    padding: 2vh 1vw;
    .box{
      height: 100%;
      background-color: #7b85d9;
      border-radius: 5%;
      border:2px double #6a83ff;
      .btn-box {
        height: 10%;
        width: 100%;
        .title {
          color: #fff;
          font-size: 2.8vh;
          margin-top: 50px;
          margin-left: 10%;
        }
      }
      .form-box {
        margin: 2vh 2vw;
        color: #ffffff;
        .el-form-item__label {
          color: #ffffff;
          font-size: 2.2vh;
        }
        .editbtns {
          float: right;
        }
        .el-select__wrapper.is-focused {
          box-shadow: 0 0 0 1px #6a83ff inset;
        }
        .savebtn {
          --el-button-bg-color: #6a83ff;
          --el-button-hover-bg-color: #6a83ff75;
          --el-button-hover-border-color: #6a83ff;
        }
        .cancelbtn {
          --el-button-hover-text-color: #6a83ff;
        }
      }
      .table-box {
        height: 80%;
        background-color: #fff;
        text-align: center;
        border-radius: 10px;
      }
    }
  }
}
</style>
