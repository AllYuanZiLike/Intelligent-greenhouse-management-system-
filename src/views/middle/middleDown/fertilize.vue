<template>
  <el-drawer
      v-model="visibleDrawer"
      direction="rtl"
      size="40%"
      :with-header="false"
  >
    <div class="box">

      <div class="btn-box">
        <div class="title">施肥设备</div>
        <el-button @click="dialogVisible=true">添加设备</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData.dataList" height="450" style="width: 100%">
          <el-table-column prop="name" label="设备名字" width="100" align="center" />
          <el-table-column prop="status" label="状态" width="120"  align="center"/>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="openUpdate(scope.row.id)">
                修改
              </el-button>
              <!--              <el-popconfirm title="确定要删除吗？" confirm-button-text="确定" cancel-button-text="取消" @confirm="deleteGreenhouse(scope.row.id)">-->
              <!--                <template #reference>-->
              <el-button link type="primary" size="small" @click="deleteGreenhouse(scope.row.id)">删除</el-button>
              <!--                </template>-->
              <!--              </el-popconfirm>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next,sizes" v-model:current-page="tableData.current" @current-change="handleCurrentChange"
                       v-model:page-size="tableData.size" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange"
                       v-model:total="tableData.total" />
      </div>
    </div>
  </el-drawer>

  <!--  添加温室弹窗-->
  <el-dialog
      v-model="dialogVisible"
      :title="dataForm.id?'修改设备':'添加设备'"
      width="25vw"
      center
      class="login"
  >
    <el-form

        ref="dataFormRef"
        style="width: 20vw;"
        :model="dataForm"
        status-icon
        :rules="dataFormRules"
        label-width="auto"
    >
      <el-form-item label="设备名字" prop="name">
        <el-input v-model.number="dataForm.name" />
      </el-form-item>
      <el-form-item label="状态" prop="location">
        <el-select v-model="dataForm.status" placeholder="请选择或者输入新值">
          <el-option v-for="item in statusText" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="addOrUpdateGreenhouse(dataFormRef)">确认</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import { Search } from '@element-plus/icons-vue'
import service from "@/axios";
import store from "@/store";
import {ElMessage, FormInstance, FormRules} from "element-plus";

const visibleDrawer = ref(false)
const init = ()=>{
  visibleDrawer.value = true;
  getGreenhouseList();
}

const dialogVisible = ref(false)

const statusText = reactive([
  {value:"空闲中",label:"空闲中"},
  {value:"已停用",label:"已停用"},
])
const dataFormRef = ref()
const dataForm = reactive({
  id:"",
  gid:"",
  name:"",
  status:"",
  type:5
})

const dataFormRules = reactive<FormRules<typeof dataForm>>({
  name: [{ required:true, trigger: 'blur' }],
  status: [{ required:true, trigger: 'blur' }],
  type: [{ required:true, trigger: 'blur' }]
})

const openUpdate = (id:number)=>{
  service.get("/dev/getDev",{params:{id:id}}).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false
    Object.assign(dataForm,res.data.data)
    dialogVisible.value = true
  })
}
const addOrUpdateGreenhouse = (formEl: FormInstance | undefined)=>{
  dataForm.gid = greenhouse.gid
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(dataForm)
      dataForm.id?service.put("/dev/updateDev",dataForm).then(res=>{
            console.log(res)
            if(res.data.code != 200) return false
            ElMessage.success(res.data.msg)
            dialogVisible.value = false;
            getGreenhouseList()
          })
          :service.post("/dev/addDev",dataForm)
              .then(res=>{
                console.log(res)
                if(res.data.code != 200) return false
                ElMessage.success(res.data.msg)
                dialogVisible.value = false;
                getGreenhouseList()
              })
    }
  })
}

const deleteGreenhouse = (id:number)=>{
  service.delete(`/dev/deleteDev`,{params:{id:id}}).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false
    ElMessage.success(res.data.msg);
  })
}

const tableData = reactive({
  current:1,
  size:10,
  total:0,
  dataList:[]
});

const getGreenhouseList = ()=>{
  service.get("/dev/getPagesByType",{params:{gid:greenhouse.gid,type:5,pageNum:tableData.current,pageSize:tableData.size}}).then(res=> {
    console.log(res)
    if (res.data.code != 200) return false
    tableData.total = res.data.data.totalCount;
    tableData.current = res.data.data.currentPage;
    tableData.dataList=res.data.data.list
    console.log(tableData.total)
  })
}

const handleCurrentChange = (val:number)=>{
  tableData.current = val
  getGreenhouseList()
}
const handleSizeChange = (val:number)=>{
  tableData.size = val
  getGreenhouseList()
}

const greenhouse = reactive({
  gid: "1",
  isLogin:false
})
const isLogin = ref(false)
const getGreenhouseId = (id:string,login:boolean)=>{
  greenhouse.gid = id
  isLogin.value = login
  console.log(id)
}
defineExpose({
  init,getGreenhouseId
})
</script>

<style scoped lang="less">
.el-drawer.rtl{
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
