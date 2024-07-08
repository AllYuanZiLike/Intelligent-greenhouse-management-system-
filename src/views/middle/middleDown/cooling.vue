<template>
  <el-drawer
      class="cooling"
      v-model="visibleDrawer"
      direction="rtl"
      size="40%"
      :with-header="false"
  >
    <div class="box">

      <div class="btn-box">
        <div class="title">降温设备</div>
        <el-button class="addbtn" @click="dialogVisible=true">添加设备</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData.dataList" height="450" style="width: 100%">
          <el-table-column prop="name" label="设备名字" width="180" align="center" />
          <el-table-column prop="status" label="状态" width="180"  align="center"/>
          <el-table-column fixed="right" label="操作" width="150">
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
        <div class="pagination">
          <el-pagination layout="prev, pager, next,sizes" v-model:current-page="tableData.current" @current-change="handleCurrentChange"
                         v-model:page-size="tableData.size" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange"
                         v-model:total="tableData.total" />
        </div>
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
        <el-button class="confirmbtn" type="primary" @click="addOrUpdateGreenhouse(dataFormRef)">确认</el-button>
        <el-button class="cancelbtn" @click="dialogVisible=false">取消</el-button>
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
  type:1
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
            let noDataForm = {
              id:"",
              gid:"",
              name:"",
              status:"",
              type:1
            }
            Object.assign(dataForm,noDataForm)
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
  service.get("/dev/getPagesByType",{params:{gid:greenhouse.gid,type:1,pageNum:tableData.current,pageSize:tableData.size}}).then(res=> {
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
  gid: "",
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

<style lang="less">
.cooling{
  background-color: transparent !important;

  .el-drawer__body {
    padding: 2vh 1vw;
    .box{
      height: 100%;
      background-color: #7b85d9;
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
        .addbtn {
          --el-button-hover-text-color: #6a83ff;
        }
      }
      .table-box {
        height: 80%;
        //background-color: #fff;
        text-align: center;
        border-radius: 10px;
        background-color: #7b85d9;
        .el-table {
          --el-table-header-bg-color: #7b85d9;
          --el-table-bg-color: #7b85d9;
          --el-table-tr-bg-color: #7b85d9;
          --el-table-text-color: #fff;
          --el-table-row-hover-bg-color: #6a83ff;
          .el-button--primary.is-link, .el-button--primary.is-plain, .el-button--primary.is-text {
            --el-button-text-color: #ffffff;
          }
        }
        .el-table thead {
          color: #fff;
        }
        .pagination {
          margin-top: 35px;
          float: right;
          //background-color: #7b85d9;
          .el-pagination {
            --el-pagination-bg-color: #7b85d9;
            --el-pagination-text-color: #7b85d9;
            --el-pagination-button-disabled-color: #ffffff;
            --el-pagination-button-disabled-bg-color: #7b85d9;
            --el-pagination-hover-color: #ffffff;
            .el-select__wrapper {
              background-color: #7b85d9;
              box-shadow: 0 0 0 1px #6a83ff inset;
            }
            .el-select__placeholder {
              color: #fff;
            }
            .el-select__caret {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
.el-dialog {
  --el-dialog-bg-color: #7b85d9 !important;
  .el-dialog__title {
    color: #fff;
  }
  .el-form-item__label {
    color: #fff;
  }
  .confirmbtn {
    --el-button-bg-color: #6a83ff;
    --el-button-hover-bg-color: #6a83ff75;
    --el-button-hover-border-color: #6a83ff;
  }
  .cancelbtn {
    --el-button-hover-text-color: #6a83ff;
  }
  .el-input {
    --el-input-focus-border-color: #6a83ff;
  }
}
</style>
