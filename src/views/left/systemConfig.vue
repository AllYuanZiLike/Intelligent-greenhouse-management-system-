<template>
  <el-drawer
      class="systemconfig"
      v-model="visibleDrawer"
      direction="rtl"
      size="40%"
      :with-header="false"
  >
    <div class="box">

      <div class="btn-box">
        <div class="title">系统配置</div>
        <el-button class="addbtn" @click="dialogVisible=true">添加配置</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData.dataList" height="450" style="width: 100%;">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="key" label="键" width="150" align="center" />
          <el-table-column prop="value" label="值" width="150"  align="center"/>
          <el-table-column fixed="right" label="操作" width="150" align="center">
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
      :title="dataForm.id?'修改配置':'添加配置'"
      width="25vw"
      center
  >
    <el-form

        ref="dataFormRef"
        style="width: 20vw;"
        :model="dataForm"
        status-icon
        :rules="dataFormRules"
        label-width="auto"
    >
      <el-form-item label="键" prop="key">
        <el-input v-model.number="dataForm.key" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="dataForm.value" />
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
  getConfigList();
}

const dialogVisible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
  id:"",
  uid:"",
  key:"",
  value:""
})

const dataFormRules = reactive<FormRules<typeof dataForm>>({
  key: [{ required:true, trigger: 'blur' }],
  value: [{ required:true, trigger: 'blur' }],
})

const openUpdate = (id:number)=>{
  service.get("/sys/get",{params:{id:id}}).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false
    Object.assign(dataForm,res.data.data)
    dialogVisible.value = true
  })
}
const addOrUpdateGreenhouse = (formEl: FormInstance | undefined)=>{
  dataForm.uid = store.state.userInfo.id
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(dataForm)
      dataForm.id?service.put("/sys/update",dataForm).then(res=>{
            console.log(res)
            if(res.data.code != 200) return false
            ElMessage.success(res.data.msg)
            dialogVisible.value = false;
            getConfigList()
            let dataFormInit = {
              id:"",
              uid:"",
              key:"",
              value:""
            }
            Object.assign(dataForm,dataFormInit)
          })
          :service.post("/sys/add",dataForm)
              .then(res=>{
                console.log(res)
                if(res.data.code != 200) return false
                ElMessage.success(res.data.msg)
                dialogVisible.value = false;
                getConfigList()
              })
    }
  })
}

const deleteGreenhouse = (id:number)=>{
  service.delete(`/sys/delete`,{params:{id:id}}).then(res=>{
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

const getConfigList = ()=>{
  service.get("/sys/getPages",{params:{uid:store.state.userInfo.id,pageNum:tableData.current,pageSize:tableData.size}}).then(res=> {
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
  getConfigList()
}
const handleSizeChange = (val:number)=>{
  tableData.size = val
  getConfigList()
}


defineExpose({
  init,getConfigList
})
</script>

<style lang="less">
.systemconfig{
  background-color: transparent !important;

  .el-drawer__body {
    padding: 2vh 1vw;
    .box{
      height: 100%;
      background-color: #c6cbff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 5%;
      border:2px double #6a83ff;
      .btn-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 10%;
        width: 80%;
        .title {
          color: #fff;
          font-size: 2.8vh;
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
