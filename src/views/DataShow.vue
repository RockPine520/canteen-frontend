<template>
  <el-scrollbar height="90vh">
    <div style="margin-left: 8vw; margin-top: 20px">
      <el-select v-model="selectDepId" class="m-2" placeholder="请选择部门">
        <el-option
            v-for="item in depOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="checkData">查询</el-button>
    </div>
    <el-row class="row" :gutter="20">
      <el-col :span="12">
        <el-card class="box-card-two">
          <v-chart class="chart" :option="sexOption" autoresize/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card-two">
          <v-chart class="chart" :option="typeNumOption" autoresize/>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="row" :gutter="20">
      <el-col :span="24">
        <el-card class="box-card-one">
          <v-chart class="chart" :option="empNumOption" autoresize/>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>

</template>

<script>
import request from "@/plugins/request";
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {PieChart, BarChart} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components';
import VChart, {THEME_KEY} from 'vue-echarts';
import {ref, defineComponent} from 'vue';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
]);

export default {
  name: "DataShow",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'basic',
  },
  data() {
    return {
      sexData: [],
      depNumData:[],
      empNumData:[],
      depOptions: [],
      selectDepId: undefined,
      depName:'',
    }
  },

  methods: {
    loadData() {
      request.get('/department/all').then(res => {
        this.depOptions = res.data.map(item => {
          return {value: item.depId, label: item.depName}
        })
      })
      this.empNumData = []
      request.get('/data/getDepEmpNum').then(res=>{
        console.log("empNum:",res)
        for (let key in res.data){
          let temp = {
            value:res.data[key],
            name: key
          }
          this.empNumData.push(temp)
        }
      })
    },
    checkData(){
      request.get('/data/getSexNum/'+this.selectDepId).then(res=>{
        console.log('sexRes:',res)
        let new_arr = this.depOptions.filter(item=>item.value===this.selectDepId)
        this.depName = new_arr[0].label
        this.sexData = res.data
      })
      this.depNumData = []
      request.get('/data/getEachDepProNum/'+this.selectDepId).then(res=>{
        console.log('depRes:',res.data)
        for (let key in res.data){
          let temp = {
            value:res.data[key],
            name: key
          }
          this.depNumData.push(temp)
        }
        console.log(this.depNumData)
      })
    }
  },
  created() {
    this.loadData()
  },

  computed: {
    sexOption() {
      return {
        title: {
          text: this.depName + '性别比例',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['男', '女'],//这里可以用map映射 this.sexdata.map(d=>d.sex)
        },
        series: [
          {
            name: '性别比例',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: this.sexData[1], name: '男'},
              {value: this.sexData[0], name: '女'},
            ],// 这里就直接字典赋值
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
    },
    typeNumOption() {
      return {
        title: {
          text: this.depName + '工种比例',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          // data: ['厨师', '清洁', '备菜', '打饭'],//这里可以用map映射 this.sexdata.map(d=>d.sex)
          data: this.depNumData.map(d=>d.name)
        },
        series: [
          {
            name: '工种比例',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            // data: [
            //   {value: 50, name: '厨师'},
            //   {value: 310, name: '清洁'},
            //   {value: 100, name: '备菜'},
            //   {value: 180, name: '打饭'},
            // ],// 这里就直接字典赋值
            data: this.depNumData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
    },
    empNumOption() {
      return {
        title: {
          text: '各个食堂员工数量',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.empNumData.map(d=>d.name),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.empNumData.map(d=>d.value)
          }
        ]
      }
    }
  }
}

</script>

<style scoped>
.chart {
  height: 30vh;
}

.row {
  margin-left: 100px !important;
}

.box-card-two {
  width: 34vw;
  margin-top: 30px;
}

.box-card-one {
  width: 75vw;
  /*height: 50%;*/
  margin-top: 30px;
}
</style>