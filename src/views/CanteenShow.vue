<template>
  <div>
    <el-row class="fig-head">
      各食堂进出总人数实时统计
    </el-row>
    <el-scrollbar height="43vh" style="margin-top: 1vh">
      <el-row style="margin-left: 6vw">
        <el-col v-for="oneCanteen in inOutCounts" :span="8" style="margin-top: 3vh">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span style="font-weight: bold;">{{ oneCanteen.name }}</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-statistic title="进入人数" :value="oneCanteen.in" :value-style="{color:'#27D63A'}"/>
              </el-col>
              <el-col :span="8">
                <el-statistic title="离开人数" :value="oneCanteen.out" :value-style="{color:'#FF484D'}"/>
              </el-col>
              <el-col :span="8">
                <el-statistic title="当前人数" :value="oneCanteen.all" :value-style="{color:'#4390FF'}"/>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
    <div>
      <el-row class="fig2-head">
        食堂各时间点人流量
        <div class="date-picker">
          <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div style="width: 6vw; margin-left: 1vw">
          <el-input v-model="interval" type="number" placeholder="时间间隔(分钟)"></el-input>
        </div>
        <div class="confirm-button">
          <el-button type="primary" plain style="margin-left: 1vw;margin-right: 4vw" @click="checkPersonNum">查询</el-button>
        </div>
      </el-row>
      <el-row style="margin-left: 6vw">
        <v-chart class="chart" :option="option" autoresize/>
      </el-row>
    </div>
  </div>
</template>

<script>
import request from "@/plugins/request";
import {use, util} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {PieChart, BarChart} from 'echarts/charts';
import {
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent
} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import VChart, {THEME_KEY} from 'vue-echarts';
import {ref, defineComponent} from 'vue';

use([
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TransformComponent,
  LineChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition
]);
export default {
  name: "CanteenShow",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'basic',
  },
  data() {
    return {
      // inOutCounts: [
      //   [
      //     {name: "山明一楼", in: 10, out: 5, all: 0},
      //     {name: "山明二楼", in: 20, out: 12, all: 1},
      //     {name: "山明三楼", in: 12, out: 3, all: 12},
      //   ],
      //   [
      //     {name: "益新一楼", in: 10, out: 5, all: 3},
      //     {name: "益新二楼", in: 20, out: 12, all: 4},
      //     {name: "尔美一楼", in: 10, out: 5, all: 6},
      //   ]
      // ],
      inOutCounts: [
        // {name: "山明一楼", in: 10, out: 5, all: 0},
        // {name: "山明二楼", in: 20, out: 12, all: 1},
        // {name: "益新一楼", in: 10, out: 5, all: 3},
        // {name: "益新二楼", in: 20, out: 12, all: 4},
        // {name: "尔美一楼", in: 10, out: 5, all: 6},
        //
        // {name: "山明一楼", in: 10, out: 5, all: 0},
        // {name: "山明二楼", in: 20, out: 12, all: 1},
        // {name: "益新一楼", in: 10, out: 5, all: 3},
        // {name: "益新二楼", in: 20, out: 12, all: 4},
        // {name: "尔美一楼", in: 10, out: 5, all: 6},
      ],
      rowData: [
        // {name: "山明一楼", all: 8, time: "2023-04-25 15:06:14"},
        // {name: "山明二楼", all: 1, time: "2023-04-25 15:06:14"},
        // {name: "山明三楼", all: 12, time: "2023-04-25 15:06:14"},
        // {name: "益新一楼", all: 3, time: "2023-04-25 15:06:14"},
        // {name: "益新二楼", all: 4, time: "2023-04-25 15:06:14"},
        // {name: "尔美一楼", all: 6, time: "2023-04-25 15:06:14"},
        //
        // {name: "山明一楼", all: 11, time: "2023-04-25 15:08:14"},
        // {name: "山明二楼", all: 22, time: "2023-04-25 15:08:14"},
        // {name: "山明三楼", all: 32, time: "2023-04-25 15:08:14"},
        // {name: "益新一楼", all: 34, time: "2023-04-25 15:08:14"},
        // {name: "益新二楼", all: 42, time: "2023-04-25 15:08:14"},
        // {name: "尔美一楼", all: 36, time: "2023-04-25 15:08:14"},
        // //
        // {name: "山明一楼", all: 31, time: "2023-04-25 15:10:14"},
        // {name: "山明二楼", all: 12, time: "2023-04-25 15:10:14"},
        // {name: "山明三楼", all: 42, time: "2023-04-25 15:10:14"},
        // {name: "益新一楼", all: 24, time: "2023-04-25 15:10:14"},
        // {name: "益新二楼", all: 32, time: "2023-04-25 15:10:14"},
        // {name: "尔美一楼", all: 56, time: "2023-04-25 15:10:14"},
        //
        // {name: "山明一楼", all: 21, time: "2023-04-25 15:12:14"},
        // {name: "山明二楼", all: 22, time: "2023-04-25 15:12:14"},
        // {name: "山明三楼", all: 52, time: "2023-04-25 15:12:14"},
        // {name: "益新一楼", all: 34, time: "2023-04-25 15:12:14"},
        // {name: "益新二楼", all: 62, time: "2023-04-25 15:12:14"},
        // {name: "尔美一楼", all: 22, time: "2023-04-25 15:12:14"},
      ],
      _rawData: [],
      datasetWithFilters: [],
      seriesList: [],
      start: undefined,
      end:undefined,
      interval:undefined,
      canteensName: [],
      value1:'',
    }
  },
  methods: {
    loadFlowData() {
      request.get('/api/camera/getFlowData').then(res => {
        this.inOutCounts = res
        // console.log("inout:",this.inOutCounts)
      }).catch(err=>{
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    loadData() {
      let today = new Date()
      let year = today.getFullYear()
      let month = (today.getMonth() + 1).toString().padStart(2, '0')
      let day = today.getDate().toString().padStart(2, '0')
      if (this.start===undefined){
        this.start = `${year}-${month}-${day} 01:00:00`
      }
      if (this.end===undefined){
        this.end = `${year}-${month}-${day} 23:00:00`
      }
      if (this.interval===undefined || this.interval<=0){
        this.interval = 60
      }
      console.log(this.start)
      // let tmp = `2023-04-28`
      // let startTime = tmp + ` 00:00:00`
      // let endTime = tmp + ` 23:59:59`
      // let startTime = `${year}-${month}-${day} 01:00:00`
      // let endTime = `${year}-${month}-${day} 23:00:00`
      let canteens = []
      request.get('/department/all').then(res=>{
        // console.log(res)
        canteens = res.data.map((item)=>item.depName)
        this.canteensName = canteens
        const datasetWithFilters = []
        const seriesList = []
        util.each(canteens, function (canteen) {
          let datasetId = 'dataset_' + canteen;
          datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
              type: 'filter',
              config: {
                and: [
                  // { dimension: "time", gte: 1800 },
                  {dimension: "name", '=': canteen}
                ]
              }
            }
          });
          seriesList.push({
            type: 'line',
            datasetId: datasetId,
            showSymbol: false,
            name: canteen,
            endLabel: {
              show: false,
              formatter: function (params) {
                console.log("params,", params.value)
                return params.value.name + ': ' + params.value.all;
              }
            },
            labelLayout: {
              moveOverlap: 'shiftY'
            },
            emphasis: {
              focus: 'series'
            },
            encode: {
              x: 'time',
              y: 'all',
              label: ['name', 'all'],
              itemName: 'time',
              tooltip: 'all'
            }
          });
        })
        this.datasetWithFilters = datasetWithFilters
        this.seriesList = seriesList
      }).catch(err=>{
        this.$message({
          message: err,
          type: 'error'
        })
      })
      request.post('/api/camera/getFlowDataByTime', {
        startTime: this.start,
        endTime: this.end,
        interval: this.interval
      }).then(res => {
        // console.log("flowByTime:", res)
        this.rowData = res
      }).catch(err=>{
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    checkPersonNum(){
      console.log("value1:",this.value1)
      this.start = this.value1[0]
      this.end = this.value1[1]
      this.loadData()
    }
  },
  created() {
    // this.loadFlowData()
    // this.loadData()
  },
  mounted() {
    this.loadFlowData()
    this.loadData()
    setInterval(()=>{
      this.loadFlowData()
    },1000)
    setInterval(()=>{
      this.loadData()
    },60000) // 1min
  },
  computed: {
    option() {
      return {
        animationDuration: 1000,
        dataset: [
          {
            id: 'dataset_raw',
            dimensions: ['name', 'all', 'time'],
            source: this.rowData
          },
          ...this.datasetWithFilters
        ],
        legend: {
          data: this.canteensName
        },
        // title: {
        //   text: '食堂各时间点人流量图'
        // },
        tooltip: {
          order: 'valueDesc',
          trigger: 'axis'
        },
        xAxis: {
          type: 'time',
          // name:'时间',
          nameLocation: 'middle',
          // interval: 3600,
        },
        yAxis: {
          type: 'value',
          name: '总人数'
        },
        grid: {
          right: 160
        },
        series: this.seriesList
      }
    }
  }
}
</script>

<style scoped>
.fig-head {
  /*margin-top: 1vh;*/
  margin-left: 4vw;
  font-weight: bold;
  font-size: 18px;
  color: #464646;
}

.fig2-head {
  margin-top: 2vh;
  margin-left: 4vw;
  font-weight: bold;
  font-size: 18px;
  color: #464646;
}

.box-card {
  width: 20vw;
}

.el-col {
  text-align: center;
}

.card-header {
  height: 1vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart {
  margin-top: 10px;
  height: 40vh;
  width: 100vw;
}

.date-picker{
  /*width: 100vw;*/
  font-weight: normal;
  text-align: right;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
</style>