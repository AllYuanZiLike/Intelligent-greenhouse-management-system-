<template>
  <el-drawer class="greenhouse"
      v-model="visibleDrawer"
      title="温室"
      direction="rtl"
      size="40%"
      :with-header="false"
  >
    <div class="box">

      <div class="btn-box">
        <div class="title">温室</div>
        <el-button class="addbtn" @click="dialogVisible=true">添加温室</el-button>
      </div>
      <div class="table-box">
        <el-table :data="tableData.dataList" height="450" style="width: 100%" @row-click="toggleGreenhouse">
          <el-table-column prop="name" label="温室名字" width="100" align="center" />
          <el-table-column prop="location" label="温室位置" width="130"  align="center"/>
          <el-table-column prop="description" label="描述" width="160" align="center" />
          <el-table-column fixed="right" label="操作" width="120" align="center">
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
      :title="dataForm.id?'修改温室':'添加温室'"
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
      <el-form-item label="温室名字" prop="name">
        <el-input v-model.number="dataForm.name" />
      </el-form-item>
      <el-form-item label="温室位置" prop="location">
        <el-input v-model="dataForm.location" />
      </el-form-item>
      <el-form-item label="温室描述" prop="description">
        <el-input v-model="dataForm.description"  />
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
const dataFormRef = ref()
const dataForm = reactive({
  id:"",
  uid:"",
  name:"",
  location:"",
  description:""
})

const dataFormRules = reactive<FormRules<typeof dataForm>>({
  name: [{ required:true, trigger: 'blur' }],
  location: [{ required:true, trigger: 'blur' }],
  description: [{ required:true, trigger: 'blur' }]
})

const openUpdate = (id:number)=>{
  service.get("/greenHouse/getById",{params:{id:id}}).then(res=>{
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
      dataForm.id?service.put("/greenHouse/updateGreenHouse",dataForm).then(res=>{
        console.log(res)
        if(res.data.code != 200) return false
        ElMessage.success(res.data.msg)
        dialogVisible.value = false;
        getGreenhouseList()
      })
      :service.post("/greenHouse/addGreenHouse",dataForm)
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
  service.delete(`/greenHouse/deleteGreenHouse/${id}`).then(res=>{
    console.log(res)
    if(res.data.code!=200) return false
    ElMessage.success(res.data.msg);
  })
}

const emits = defineEmits(['switchGreenhouse'])
const toggleGreenhouse = (row: any)=>{
  console.log(row)
  emits("switchGreenhouse",row.id)
  visibleDrawer.value = false;
}

const tableData = reactive({
  current:1,
  size:10,
  total:0,
  dataList:[]
});

const getGreenhouseList = ()=>{
  service.get("/greenHouse/getPages",{params:{uid:store.state.userInfo.id,pageNum:tableData.current,pageSize:tableData.size}}).then(res=> {
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


defineExpose({
  init,getGreenhouseList
})
</script>

<style lang="less">
.greenhouse{
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
        .addbtn {
          --el-button-hover-text-color: #6a83ff;
        }
      }
      .table-box {
        height: 80%;
        //background-color: #fff;
        text-align: center;
        border-radius: 10px;
        background-color: #c6cbff;
        .el-table {
          --el-table-header-bg-color: #c6cbff;
          --el-table-bg-color: #c6cbff;
          --el-table-tr-bg-color: #c6cbff;
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
          //background-color: #c6cbff;
          .el-pagination {
            --el-pagination-bg-color: #c6cbff;
            --el-pagination-text-color: #c6cbff;
            --el-pagination-button-disabled-color: #ffffff;
            --el-pagination-button-disabled-bg-color: #c6cbff;
            --el-pagination-hover-color: #ffffff;
            .el-select__wrapper {
              background-color: #c6cbff;
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
  --el-dialog-bg-color: #c6cbff !important;
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
