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
            <el-table-column label="上班时间" prop="day" align="center"/>
            <el-table-column label="考勤时间" prop="validCycle" align="center">
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
    <el-dialog
        v-model="addDialogVisible"
        title="新增部门信息"
        width="30%"
        :before-close="addClose"
    >
      <el-form :model="form" :rules="rules" ref="addFormRef" label-width="70px" :label-position='labelPosition'>
        <el-form-item label="部门名" prop="depName">
          <el-input v-model="form.depName" style="width: 90%"/>
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
    <el-dialog
        v-model="editDialogVisible"
        title="编辑部门信息"
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
      form: {},
      labelPosition: 'right',
      rules: {
        depName: [
          {required: true, message: "请输入部门名称", trigger: 'blur'},
        ],
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
      aWeekdays:[]
    }
  },

  methods: {
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

</style>