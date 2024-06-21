<template>
  <el-drawer
      v-model="visibleDrawer"
      direction="rtl"
      size="50%"
      :with-header="false"
  >
    <div class="box">

      <div class="btn-box">
        <div class="title">报警记录</div>
      </div>
      <div class="table-box">
        <el-table :data="tableData.dataList" height="75%" style="width: 100%">
          <el-table-column prop="parameter" label="环境参数" width="100" align="center" />
          <el-table-column prop="value" label="数值" width="120"  align="center"/>
          <el-table-column prop="time" label="时间" align="center" />
          <el-table-column prop="actionTaken" label="采取措施" align="center" />
        </el-table>
        <el-pagination layout="prev, pager, next,sizes" v-model:current-page="tableData.current" @current-change="handleCurrentChange"
                       v-model:page-size="tableData.size" :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange"
                       v-model:total="tableData.total" />
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
