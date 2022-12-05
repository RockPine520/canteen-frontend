<template>
  <div>
    <div class="button-group">
      <el-button type="primary" @click="addDialogVisible=true">
        <el-icon style="margin-right:3px">
          <CirclePlusFilled/>
        </el-icon>
        新增
      </el-button>
      <el-button type="danger" :disabled="deleteButtonShow" @click="deleteGroup">
        <el-icon style="margin-right:3px">
          <DeleteFilled/>
        </el-icon>
        删除
      </el-button>
    </div>

    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        max-height="500"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column sortable prop="ruleId" label="规则编号" align="center"></el-table-column>
      <el-table-column prop="ruleName" label="规则名称" align="center"></el-table-column>
      <el-table-column type="expand" prop="weekday" style="width: 100%">
        <template #default="scope">
          <h3 style="text-align: center">规则详情</h3>
          <el-table :data="scope.row.weekday">
            <el-table-column label="上班日" prop="day" align="center"/>
            <el-table-column label="打卡时间" prop="validCycle" align="center">
              <template #default="scope1">
                <div v-for="(item,index) in scope1.row.validCycle" :key="index">
                  <div v-if="index===0">
                    <el-tag type="success">开始时间：{{item.startTime}}</el-tag> —
                    <el-tag type="warning">结束时间：{{item.endTime}}</el-tag>
                  </div>
                  <div v-else style="margin-top: 10px">
                    <el-tag type="success">开始时间：{{item.startTime}}</el-tag> —
                    <el-tag type="warning">结束时间：{{item.endTime}}</el-tag>
                  </div>
                </div>
              </template>
<!--              <el-table-column prop="validCycle[0].startTime" label="开始时间" align="center" />-->
<!--              <el-table-column prop="validCycle[0].endTime" label="结束时间" align="center" />-->
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleSendRule(scope.row)">下发</el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
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
<!--    新增规则-->
    <el-dialog
        v-model="addDialogVisible"
        title="新增规则"
        width="30%"
        :before-close="addClose"
    >
      <el-form :model="form" :rules="rules" ref="addFormRef" label-width="70px" :label-position='labelPosition'>
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="form.ruleName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="考勤时间" prop="weekDay">
          <el-button type="primary" @click="timeDialogOpen">
            <el-icon style="margin-right:3px">
              <CirclePlusFilled/>
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogClose('addFormRef')">取消</el-button>
        <el-button type="primary" @click="addSave('addFormRef')">
          保存
        </el-button>
      </span>
      </template>
    </el-dialog>
<!--设置打卡时间-->
    <el-dialog
        v-model="setSignTimeVisible"
        title="设置打卡时间"
        width="60%"
        :before-close="timeClose"
    >
<!--      注：weekday这个字段实现了双向绑定-->
      <el-form :model="form.weekday[weekIndex]" ref="timeFormRef" label-width="70px" label-position="top">
        <el-form-item label="工作日" prop="day" :rules="timeRules.day">
          <el-checkbox-group v-model="form.weekday[weekIndex].day">
            <el-checkbox label="星期一" name="day"></el-checkbox>
            <el-checkbox label="星期二" name="day"></el-checkbox>
            <el-checkbox label="星期三" name="day"></el-checkbox>
            <el-checkbox label="星期四" name="day"></el-checkbox>
            <el-checkbox label="星期五" name="day"></el-checkbox>
            <el-checkbox label="星期六" name="day"></el-checkbox>
            <el-checkbox label="星期日" name="day"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="打卡时间">
<!--          <el-time-select v-model="endTime" placeholder="结束时间" start="06:00" step="00:15" end="24:00"></el-time-select>-->
          <el-form-item v-for="(validTime,index) in form.weekday[weekIndex].validCycle" :key="validTime.key">
            <div :class="index===0?'normal':'mgt10px'">
              <el-tag>
                时间段{{index+1}}
              </el-tag>
              <el-form-item :prop="`validCycle.${index}.startTime`" :rules="timeRules.startTime" style="margin-left: 10px">
                <el-time-select :disabled="index!==nIndex" v-model="validTime.startTime" placeholder="起始时间" :start="sTime" :step="timeStep" :end="eTime" :max-time="validTime.endTime"></el-time-select>
              </el-form-item>
              <el-form-item :prop="`validCycle.${index}.endTime`" :rules="timeRules.endTime" style="margin-left: 10px">
                <el-time-select :disabled="index!==nIndex" v-model="validTime.endTime" placeholder="结束时间" :start="sTime" :step="timeStep" :end="eTime" :min-time="validTime.startTime"></el-time-select>
              </el-form-item>
              <el-button :disabled="index!==nIndex || validTime.startTime.length===0 || validTime.endTime.length===0" type="primary" @click.prevent="addValidTime(validTime.endTime,index)" style="margin-left: 12px">新增</el-button>
              <el-button :disabled="index!==nIndex || index===0" type="danger" @click.prevent="removeValidTime(validTime)">删除</el-button>
            </div>
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="timeClose">取消</el-button>
        <el-button type="primary" @click="timeDialogSave('timeFormRef')">
          保存
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog
        v-model="editDialogVisible"
        title="编辑规则"
        width="30%"
        :before-close="editClose"
    >
      <el-form :model="form" :rules="rules" ref="editFormRef" label-width="70px" :label-position='labelPosition'>
        <el-form-item label="部门名" prop="depName">
          <el-input v-model="form.depName" style="width: 90%"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogClose('editFormRef')">取消</el-button>
        <el-button type="primary" @click="editSave('editFormRef')">
          保存
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {CirclePlusFilled, Promotion, DeleteFilled, EditPen, CirclePlus, Delete} from '@element-plus/icons-vue'
import request from "@/plugins/request";

let id = 1000;
export default {
  name: "Sign",
  components: {
    CirclePlusFilled, Promotion, DeleteFilled, EditPen, CirclePlus, Delete
  },
  data() {

    return {
      tableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setSignTimeVisible:false,
      form: {
        ruleId:"",
        ruleName:"",
        version:1,
        weekday:[{
          day:[],
          validCycle:[{
            startTime:'',
            endTime:'',
            key:''
          }]
        }],
        passable:[{
          start:'',
          end:'',
          validCycle:[{
            startTime:'',
            endTime:''
          }]
        }],
        impassable:[{
          start:'',
          end:'',
          validCycle:[{
            startTime:'',
            endTime:''
          }]
        }],
      },
      addTimeAble:true,
      sTime:'03:00',
      eTime:'22:00',
      timeStep:'00:15',
      nIndex:0,
      labelPosition: 'right',
      rules: {
        depName: [
          {required: true, message: "请输入部门名称", trigger: 'blur'},
        ],
      },
      timeRules:{
        startTime: [
          {required: true, message: "请选择开始打卡时间", trigger: 'change'}
        ],
        endTime: [
          {required: true, message: "请选择结束打卡时间", trigger: 'change'}
        ],
        day: [
          {required: true, message: "请选择工作日", trigger: 'change'}
        ]
      },
      addLabel: 'test',
      rowData: '',
      loading:true,
      multipleSelection: [],
      deleteButtonShow: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      small: false,
      background: false,
      disabled: false,
      search:'',
      aWeekdays:[],
      weekIndex:0
    }
  },

  methods: {
    addValidTime(cutTime,index) {
      this.form.weekday[this.weekIndex].validCycle.push({
        startTime: '',
        endTime:'',
        key: Date.now()
      });
      if (cutTime.length!==0) {
        this.sTime = cutTime
        this.nIndex = index+1
      }
      console.log("form.weekday[this.weekIndex]",this.form.weekday[this.weekIndex])
    },
    removeValidTime(item) {
      let index = this.form.weekday[this.weekIndex].validCycle.indexOf(item)
      if (index !== 0) {
        this.form.weekday[this.weekIndex].validCycle.splice(index, 1)
        this.nIndex = index-1
      }
      console.log("rform.weekday[this.weekIndex]",this.form.weekday[this.weekIndex])
    },
    loadData() {
      this.loading = true
      console.log("调用查询规则接口")
      request.get('/rule',{
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          search:this.search
        }
      }).then(res=>{
        console.log("dep_pa",res)
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
        console.log("ruledata",this.tableData)
        let trans = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
        // 取出weekday和validCycle
        let temp = this.tableData.map(item=>{
          console.log("item",item)
          let tmp = []
          item.weekday.forEach(i =>{
            // 日期格式转化
            i.day = i.day.map(t=>{
              return trans[t-1]
            })
            tmp.push({
              day:i.day,
              validCycle:i.validCycle
            })
          })
          return tmp
        })
        this.aWeekdays = temp
        console.log("tdata",this.tableData)  //引用类型，跟着转换了
      })


    },
    handleSizeChange(val) {
      console.log(`${val} items per page`)
      this.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`)
      this.currentPage = val
      this.loadData()
    },
    handleSelectionChange(val){
      console.log("val", val) // proxy包裹的数据
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      console.log("ms", this.multipleSelection)
      this.deleteButtonShow = this.multipleSelection.length <= 0;
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
    },
    addClose() {
      this.form={}
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    editClose() {
      this.form={}
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    timeClose() {
      let index = this.form.weekday.length-1
      this.form.weekday.splice(index,1)
      this.nIndex = 0
      this.weekIndex = index-1
      this.setSignTimeVisible = false
      this.$refs.timeFormRef.resetFields()
    },
    timeDialogOpen() {
      this.setSignTimeVisible = true
      this.form.weekday.push({
        day:[],
        validCycle:[{
          startTime:'',
          endTime:'',
          key:''
        }]
      })
      this.weekIndex = this.form.weekday.length-1
      this.nIndex = 0
      this.$nextTick(()=>{
        this.$refs.timeFormRef.resetFields()
      })
      console.log("weekIndex",this.weekIndex)
      console.log("this.form.weekday",this.form.weekday)
    },
    addDialogClose(formName){
      this.form={}
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    editDialogClose(formName){
      this.form={}
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    timeDialogSave(forName) {
      // let len = this.form.weekday[this.weekIndex].validCycle.length
      // if (this.form.weekday[this.weekIndex].validCycle[len-1].startTime.length===0 || this.form.weekday[this.weekIndex].validCycle[len-1].endTime.length===0){
      //   this.form.weekday[this.weekIndex].validCycle.splice(len-1, 1)
      // }
      this.$refs[forName].validate((valid)=>{
        if (valid) {
          this.setSignTimeVisible = false
          console.log("form",this.form)
        }
      })

    },
    async addSave(formName) {
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("调用新增部门接口")
          request.post('/department/addDep',this.form).then(res=>{
            console.log("addDep",res)
            if (res["code"] === 1) {
              this.$message({
                message:res.data,
                type:'success'
              })
              this.addDialogClose(formName)
              this.loadData()
            }
            else {
              this.$message.error({
                message:res.msg
              })
            }
          })
        } else {
          console.log("新增校验失败")
        }
      })
    },
    async editSave(formName) {
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("调用修改部门接口")
          console.log("edit", this.form)
          request.post('/department/editDep',this.form).then(res=>{
            console.log("editres",res)
            if (res["code"] === 1) {
              this.$message({
                message:res.data,
                type:'success'
              })
              this.editDialogClose(formName)
              this.loadData()
            }
            else {
              this.$message.error({
                message:res.msg
              })
            }
          })
        } else {
          console.log("编辑校验失败")
        }
      })
    },
    deleteGroup() {
      this.$confirm('此操作将永久删除部门信息，是否继续？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(async ()=>{
        for (let i = 0; i < this.multipleSelection.length; i++) {
          console.log("调用删除部门接口")
          request.post('/department/delDep',this.multipleSelection[i]).then(res=>{
            if (res["code"] === 1) {
              this.$message({
                message:res.data,
                type:'success'
              })
              this.loadData()
            }
            else {
              this.$message.error({
                message:res.msg
              })
            }
          })
        }
        this.loadData()
      })
    },
  },
  created() {
    this.loadData()
  }


}
</script>

<style scoped>
.button-group {
  padding: 15px;
}

.block {

}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tree-label {

}

.elT {
  /*margin: 30px;*/
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}

:deep .el-tree-node__content {
  border: 1px none #ccc;
  border-top-style: solid;
  height: 45px;
}

:deep .el-tree-node__label {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 16px;
}

.mgt10px {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.normal {
  display: flex;
  align-items: center
}
</style>