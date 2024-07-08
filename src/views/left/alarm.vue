<template>
  <el-drawer
      class="alarm"
      v-model="visibleDrawer"
      direction="rtl"
      size="40%"
      :with-header="false"
  >
    <div class="box">

      <div class="btn-box">
        <div class="title">报警记录</div>
      </div>
      <div class="table-box">
        <el-table :data="tableData.dataList" height="450" style="width: 100%">
          <el-table-column prop="parameter" label="环境参数" width="110" align="center" />
          <el-table-column prop="value" label="数值" width="110"  align="center"/>
          <el-table-column prop="time" label="时间" width="160" align="center" />
          <el-table-column prop="actionTaken" width="130" label="采取措施" align="center" />
        </el-table>
        <div class="pagination">
          <el-pagination layout="prev, pager, next,sizes" v-model:current-page="tableData.current" @current-change="handleCurrentChange"
                         v-model:page-size="tableData.size" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange"
                         v-model:total="tableData.total" />
        </div>
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

const visibleDrawer = ref(false)
const init = ()=>{
  visibleDrawer.value = true;
  getAlarmList();
}

const tableData = reactive({
  current:1,
  size:10,
  total:0,
  dataList:[]
});

const getAlarmList = ()=>{
  service.get("/al/getPages",{params:{gid:greenhouse.gid,pageNum:tableData.current,pageSize:tableData.size}}).then(res=> {
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
  getAlarmList()
}
const handleSizeChange = (val:number)=>{
  tableData.size = val
  getAlarmList()
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

<style lang="less">
.alarm{
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
</style>
