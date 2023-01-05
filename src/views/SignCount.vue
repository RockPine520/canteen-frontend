<template>
  <div>
    <div style="margin: 15px 15px">
      <span style="margin-right: 10px">考勤时间</span>
      <el-date-picker
          v-model="searchTime"
          type="month"
          value-format="YYYY-MM"
          placeholder="请选择考勤统计时间">
      </el-date-picker>
      <el-button type="primary" style="margin-left: 5px" @click="loadSignData">统计数据</el-button>
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
      <el-table-column sortable prop="userId" label="员工编号" align="center"></el-table-column>
      <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="depName" label="部门" align="center"></el-table-column>
      <el-table-column prop="proName" label="工种" align="center"></el-table-column>
      <el-table-column prop="ruleName" label="考勤规则" align="center"></el-table-column>
      <el-table-column prop="days" label="考勤天数" align="center"></el-table-column>
      <el-table-column prop="normalDays" label="正常天数" align="center"></el-table-column>
      <el-table-column prop="abnormalDays" label="异常天数" align="center"></el-table-column>
      <el-table-column prop="duration" label="工作时长" align="center"></el-table-column>
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
                max-height="400"
                @selection-change="handleSelectionChange"
      >
        <el-table-column prop="signDate" label="考勤日期" width="200" align="center">
          <template #default="scope">
            {{scope.row.year}}-{{scope.row.month}}-{{scope.row.day}} {{scope.row.weekIndex}}
          </template>
        </el-table-column>
        <el-table-column prop="start1" label="签到时间1" width="100" align="center"/>
        <el-table-column prop="end1" label="签退时间1" width="100" align="center"/>
        <el-table-column prop="start2" label="签到时间2" width="100" align="center"/>
        <el-table-column prop="end2" label="签退时间2" width="100" align="center"/>
        <el-table-column prop="start3" label="签到时间3" width="100" align="center"/>
        <el-table-column prop="end3" label="签退时间3" width="100" align="center"/>
        <el-table-column prop="num" label="打卡次数" width="100" align="center"/>
        <el-table-column prop="totalTime" label="工作时长" width="100" align="center"/>
<!--        <el-table-column prop="overWorkTime" label="加班时长" width="100" align="center"/>-->
<!--        <el-table-column prop="totalWorkTime" label="总时长" width="100" align="center"/>-->
        <el-table-column prop="status" label="状态" width="100" align="center" >
          <template #default="scope">
            <el-tag v-if="scope.row.status===0" type="warning">缺卡</el-tag>
            <el-tag v-else-if="scope.row.status===1" type="success">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openDaySignDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
<!--当天考勤记录-->
    <el-dialog
        v-model="daySignDetailVisible"
        title="当天考勤记录"
        width="50%"
    >
      <el-table :data="dayDetailData"
                v-loading="dayDetailLoading"
                stripe
                style="width: 100%"
      >
        <el-table-column prop="type" label="打卡类型" align="center"/>
        <el-table-column prop="time" label="打卡时间" align="center"/>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status===1" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.status===0" type="warning">缺卡</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="调整状态" width="100" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.status===0" type="primary" size="small" @click="changeStatus(scope.row)">补卡</el-button>
            <span v-else>正常</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--考勤状态调整-->
    <el-dialog
        v-model="changeStatusVisible"
        title="考勤状态调整"
        width="30%"
    >
      <el-form :model="statusForm" label-width="120px">
        <el-form-item label="打卡状态">
          <el-tag v-if="nStatus===0" type="warning">缺卡</el-tag>
          <el-tag v-else-if="nStatus===1" type="success">正常</el-tag>
        </el-form-item>
        <el-form-item label="调整方式">
          <el-radio-group v-model="statusForm.type">
            <el-radio :label="0" >补卡</el-radio>
<!--            <el-radio :label="1" >缺卡</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeStatusSubmit">确认</el-button>
          <el-button @click="changeStatusCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/plugins/request";

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
      searchTime: this.getNowTime(),
      sYear:'',
      sMonth:'',
      sDepId:'',
      small: false,
      background: false,
      disabled: false,
      detailData:[],
      detailLoading:false,
      daySignDetailVisible:false,
      dayDetailData:[],
      dayDetailLoading:false,
      changeStatusVisible:false,
      statusForm:{},
      nUserId:'',
      nDepId:'',
      nDate:'',
      statusDict:{
        0:'缺卡',
        1:'正常'
      },
      nStatus:'',
      nTime:'',
      changeStatusAble:'',
    }
  },
  methods:{
    getNowTime() {
      let now = new Date();
      let year = now.getFullYear(); //得到年份
      let month = now.getMonth(); //得到月份
      month = month + 1;
      month = month.toString().padStart(2, "0");
      return `${year}-${month}`;
    },
    loadSignData(){
      this.signLoading = true
      console.log("stime",this.searchTime)
      this.sYear = this.searchTime.split('-')[0]
      this.sMonth = this.searchTime.split('-')[1]
      request.get('/detail/page',{
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          year:this.sYear,
          month:this.sMonth,
          depId:this.sDepId
        }
      }).then(res=>{
        console.log("res",res)
        this.signData = res.data.records
        this.total = res.data.total
        this.signLoading = false
      }).catch(err=>{
        this.$message({
          message: err,
          type: 'error'
        })
        this.signLoading = false
      })
    },
    loadDetailData(){
      request.get('/detail/findPageById',{
        params:{
          year:this.sYear,
          month:this.sMonth,
          userId:this.nUserId
        }
      }).then(res=>{
        console.log("deres1",this.sortKey(res.data,'day'))
        this.detailData = res.data
      }).catch(err=>{

      })
      // this.detailData=[
      //   {
      //     signDate:"2022-12-21 周三",
      //     startTime1:"08:55",
      //     endTime1:"12:05",
      //     startTime2:"13:55",
      //     endTime2:"18:05",
      //     startTime3:"18:50",
      //     endTime3:"20:00",
      //     signTime:6,
      //     workTime:"08:00",
      //     overWorkTime:"0:30",
      //     totalWorkTime:"08:30",
      //     detailState:"正常",
      //   }
      // ]
    },
    loadDayDetailData(){
      this.dayDetailData = []
      console.log("date",this.nDate)
      request.get('/detail/getStatus',{
        params:{
          userId:this.nUserId,
          date:this.nDate,
          depId:this.nDepId
        }
      }).then(res=>{
        console.log("detailRes",res)
        this.dayDetailData = res.data
      }).catch(err=>{
        this.$message({
          message: err,
          type: 'error'
        })
      })
      // this.dayDetailData = [
      //   {
      //     type:'签到1',
      //     time:'19:00',
      //     status:'正常'
      //   },
      //   {
      //     type:'签退1',
      //     time:'',
      //     status:'缺卡'
      //   }
      // ]
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
      this.nUserId = row.userId
      this.nDepId = row.depId
      this.loadDetailData()
    },

    openDaySignDetail(row){
      this.daySignDetailVisible = true
      this.nDate = row.year + '-' + row.month+ '-'+row.day
      this.loadDayDetailData()
    },
    changeStatus(row) {
      // this.changeStatusVisible = true
      console.log("change",row)
      this.nStatus = row.status
      this.nType = row.type
      this.nTime = row.startTime+":00"
      this.$confirm('补卡操作不可逆，请确认','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.changeStatusSubmit()
      })

    },
    changeStatusSubmit(){
      let typeDict = {
        '上班1':1,
        '上班2':2,
        '上班3':3,
        '下班1':-1,
        '下班2':-2,
        '下班3':-3
      }
      console.log("type",typeDict[this.nType])
      // 这里我form表单的内容都没传
      request.get('/detail/editStatus',{
        params:{
          date:this.nDate,
          userId:this.nUserId,
          time:this.nTime,  // 这里打算是用打卡时间的端点来代替
          type:typeDict[this.nType]
        }
      }).then(res=>{
        console.log("changer",res)
        if (res.code===1){
          this.loadDayDetailData()
          this.loadDetailData()
        }
      })
      this.changeStatusVisible = false
    },
    changeStatusCancel(){
      this.changeStatusVisible = false
    },
    sortKey(ary, key) {
      return ary.sort(function (a, b) {
        let x = a[key]
        let y = b[key]
        return ((x > y) ? -1 : (x < y) ? 1 : 0)
      })
    }
  },
  created() {
    this.loadSignData()
  },


}
</script>

<style scoped>

</style>