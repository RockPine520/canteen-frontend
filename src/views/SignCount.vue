<template>
  <div>
    <div style="margin: 15px 15px">
      <el-input v-model="search" placeholder="请输入姓名" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadSignData">查询</el-button>
    </div>
    <el-table
        v-loading="signLoading"
        :data="signData"
        stripe
        style="width: 100%"
        max-height="500"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column sortable prop="userId" label="员工ID" align="center"></el-table-column>
      <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="userDep" label="部门" align="center"></el-table-column>
      <el-table-column prop="userPro" label="工种" align="center"></el-table-column>
      <el-table-column prop="userRule" label="考勤规则" align="center"></el-table-column>
      <el-table-column prop="signDay" label="考勤天数" align="center"></el-table-column>
      <el-table-column prop="normalDay" label="正常天数" align="center"></el-table-column>
      <el-table-column prop="abnormalDay" label="异常天数" align="center"></el-table-column>
      <el-table-column prop="totalWorkTime" label="工作时长" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="signDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 50, 100]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
        v-model="detailDialogVisible"
        :title="'【'+rowUserName+'】考勤汇总'"
        width="90%"
    >
      <el-table :data="detailData"
                v-loading="detailLoading"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
      >
        <el-table-column sortable prop="signDate" label="考勤日期" width="200" align="center"/>
        <el-table-column prop="startTime1" label="签到时间1" width="100" align="center"/>
        <el-table-column prop="endTime1" label="签退时间1" width="100" align="center"/>
        <el-table-column prop="startTime2" label="签到时间2" width="100" align="center"/>
        <el-table-column prop="endTime2" label="签退时间2" width="100" align="center"/>
        <el-table-column prop="startTime3" label="签到时间3" width="100" align="center"/>
        <el-table-column prop="endTime3" label="签退时间3" width="100" align="center"/>
        <el-table-column prop="signTime" label="打卡次数" width="100" align="center"/>
        <el-table-column prop="workTime" label="工作时长" width="100" align="center"/>
        <el-table-column prop="overWorkTime" label="加班时长" width="100" align="center"/>
        <el-table-column prop="totalWorkTime" label="总时长" width="100" align="center"/>
        <el-table-column prop="detailState" label="状态" width="100" align="center"/>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="detailDataDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SignCount",
  data() {
    return {
      signLoading:false,
      signData:[],
      multipleSelection:[],
      detailDialogVisible:false,
      rowUserName:"",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: '',
      small: false,
      background: false,
      disabled: false,
      detailData:[],
      detailLoading:false,
    }
  },
  methods:{
    loadSignData(){
      this.signData = [
        {
          userId:13,
          userName:"梅西",
          userPro:"厨师",
          userDep:"山明",
          userRule:"山明厨师考勤",
          signDay:1,
          normalDay:1,
          abnormalDay:0,
          totalWorkTime:"08:30"
        }
      ]
    },
    loadDetailData(){
      this.detailData=[
        {
          signDate:"2022-12-21 周三",
          startTime1:"08:55",
          endTime1:"12:05",
          startTime2:"13:55",
          endTime2:"18:05",
          startTime3:"18:50",
          endTime3:"20:00",
          signTime:6,
          workTime:"08:00",
          overWorkTime:"0:30",
          totalWorkTime:"08:30",
          detailState:"正常"
        }
      ]
    },
    handleSelectionChange(val){
      this.multipleSelection = JSON.parse(JSON.stringify(val))
    },
    handleSizeChange(val) {
      console.log(`${val} items per page`)
      this.pageSize = val
      this.loadSignData()
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`)
      this.currentPage = val
      this.loadSignData()
    },
    signDetail(row){
      this.detailDialogVisible = true
      this.rowUserName = row.userName
      this.loadDetailData()
    },

    detailDataDetail(row){

    },
  },
  created() {
    this.loadSignData()
  }

}
</script>

<style scoped>

</style>