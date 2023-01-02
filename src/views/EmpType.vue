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
      <el-table-column sortable prop="proId" label="工种编号" align="center"></el-table-column>
      <el-table-column prop="proName" label="工种名称" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
        title="新增工种信息"
        width="30%"
        :before-close="addClose"
    >
      <el-form :model="form" :rules="rules" ref="addFormRef" label-width="80px" :label-position='labelPosition'>
        <el-form-item label="工种名称" prop="proName">
          <el-input v-model="form.proName" style="width: 90%"/>
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
      <el-form :model="form" :rules="rules" ref="editFormRef" label-width="80px" :label-position='labelPosition'>
        <el-form-item label="工种名称" prop="proName">
          <el-input v-model="form.proName" style="width: 90%"/>
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
import {CirclePlus, CirclePlusFilled, Delete, DeleteFilled, EditPen, Promotion} from '@element-plus/icons-vue'
import request from "@/plugins/request";

let id = 1000;
export default {
  name: "EmpType",
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
        proName: [
          {required: true, message: "请输入工种名称", trigger: 'blur'},
        ],
      },
      addLabel: 'test',
      rowData: '',
      loading:false,
      multipleSelection: [],
      deleteButtonShow: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      small: false,
      background: false,
      disabled: false,
      search:''
    }
  },

  methods: {
    loadData() {
      this.loading = true
      console.log("调用查询工种接口")
      request.get('/profession',{
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          search:this.search
        }
      }).then(res=>{
        console.log("pro_res",res)
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
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
          console.log("调用新增工种接口")
          request.post('/profession/addPro',this.form).then(res=>{
            console.log("addPro",res)
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
          console.log("调用修改工种接口")
          console.log("edit", this.form)
          request.post('/profession/editPro',this.form).then(res=>{
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
          console.log("调用删除工种接口")
          request.post('/profession/delPro',this.multipleSelection[i]).then(res=>{
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