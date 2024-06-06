<template>
  <div class="home">
    <div class="header">
      <div>智能温室管理系统</div>
      <div class="my-home"><el-button class="my-btn" plain>个人主页</el-button></div>
    </div>
    <div class="main">
      <div class="left">
        <div class="left-up">
          <el-button class="btn" plain @click="table = true">设置</el-button>
          <el-drawer
              v-model="table"
              title="设置"
              direction="rtl"
              size="50%"
          >
            <el-table :data="tableData">
              <el-table-column property="date" label="Date" width="150"/>
              <el-table-column property="name" label="Name" width="200"/>
              <el-table-column property="address" label="Address"/>
            </el-table>
          </el-drawer>
          <el-button class="btn" plain @click="table2 = true">切换</el-button>
          <el-drawer
              v-model="table2"
              title="切换"
              direction="rtl"
              size="50%"
          >
            <el-table :data="tableData">
              <el-table-column property="date" label="Date" width="150"/>
              <el-table-column property="name" label="Name" width="200"/>
              <el-table-column property="address" label="Address"/>
            </el-table>
          </el-drawer>
          <el-button class="btn" plain>刷新</el-button>
        </div>
        <div class="left-down">
          <el-button class="warning-btn" plain @click="table3 = true">报警记录</el-button>
          <el-drawer
              v-model="table3"
              title="报警记录"
              direction="rtl"
              size="50%"
          >
            <el-table :data="tableData">
              <el-table-column property="date" label="Date" width="150"/>
              <el-table-column property="name" label="Name" width="200"/>
              <el-table-column property="address" label="Address"/>
            </el-table>
          </el-drawer>
        </div>
      </div>
      <div class="middle">
        <div class="middle-up">
          <div class="border-box" style="width: 730px;height: 370px;"><div id="chart"></div></div>
        </div>
        <div class="middle-down">
          <div style="width: 730px;height: 220px;">
            <div class="border-box">
              <el-table :data="tableData" height="220">
                <el-table-column prop="date" label="Date"/>
                <el-table-column prop="name" label="Name" />
                <el-table-column prop="address" label="Address" />
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <el-table :data="tableData" fit>
          <el-table-column prop="date" label="Date"/>
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted, ref} from "vue";

//折线图
//声明周期函数，自动执行初始化
onMounted(() => {
  init();
});
//初始化函数
function init() {
  let chartDom = document.getElementById('chart');
  let myChart = echarts.init(chartDom, 'dark');
  let option;

  option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };
  option && myChart.setOption(option);
}

//表格
const value = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  }
]

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

// 抽屉
const table = ref(false)
const table2 = ref(false)
const table3 = ref(false)
</script>

<style scoped>
.home {
  color: #fff;
  font-size: 30px;
  position: fixed; /* 使背景固定 */
  top: 0;
  left: 0;
  width: 100vw; /* 视口宽度 */
  overflow: hidden;
  z-index: -1; /* 确保背景在其他内容下方 */
  background-image: url('../assets/bg.png');
  background-size: 100% 100%;
  box-shadow: 0 0 3px blue;
}
.header {
  text-align: center;
  margin: 20px 0 10px 0;

}
.my-home {
  position: absolute;
  top: 20px;
  right: 100px;
}
.my-btn {
  color: #ffffff;
  background-color: #2c31;

}
.main {
  display: flex;
  justify-content: space-around;
}
.border-box {
  border: 1px solid #5d6c99;
}
.left {
  width: 15%;
  text-align: center;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}
.middle {
  width: 55%;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}
.right {
  width: 30%;
  margin-right: 10px;
}

.left-up {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  width: 100px;
  height: 50px;
  margin: 20px;
  color: #ffffff;
  background-color: #2c31;
}
.left-down {
}
.warning-btn {
  width: 100px;
  height: 50px;
  margin-top: 200px;
  color: #ffffff;
  background-color: #2c31;
}
.middle-up {
  display: flex;
  justify-content: center;
}

.middle-down {
  margin: 30px 0 12px 0;
  display: flex;
  justify-content: center;
}
/* 样式这里要设置长宽，不然显示不出来 */
#chart {
  width: 730px;
  height: 370px;
}
</style>
