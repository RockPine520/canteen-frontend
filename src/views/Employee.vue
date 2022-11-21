<template>
  <div>
    <div class="button-group">
      <el-button type="primary" @click="addUserDialogVisible=true">
        <el-icon style="margin-right:3px ">
          <CirclePlusFilled/>
        </el-icon>
        新增
      </el-button>
      <el-button type="primary">
        <el-icon style="margin-right:3px ">
          <CirclePlusFilled/>
        </el-icon>
        批量导入
      </el-button>
      <el-button type="danger" :disabled="deleteButtonShow" @click="deleteUser">
        <el-icon style="margin-right:3px">
          <DeleteFilled/>
        </el-icon>
        删除
      </el-button>
    </div>

    <div style="margin-left: 15px">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadData">查询</el-button>
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
      <el-table-column sortable prop="userId" label="员工ID" align="center" width="100"/>
      <el-table-column prop="name" label="姓名" align="center" width="100"/>
      <el-table-column prop="idValid" label="员工有效期" align="center" width="240"/>
      <el-table-column prop="group" label="员工组" align="center" width="100"/>
      <el-table-column prop="phone" label="电话号码" align="center" width="150"/>
      <el-table-column prop="idCard" label="身份证号" align="center" width="240"/>
      <el-table-column fixed="right" label="操作" width="270" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleDetail(scope.row)">用户详情</el-button>
          <el-button link type="primary" size="small">已下发设备</el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button link type="primary" size="small">识别记录</el-button>
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
    <add-user-dialog :addUserDialogVisible="addUserDialogVisible" @addDialogVisibleChange="addDialogVisibleChange"
                     @addSuccessVisibleChange="addSuccessVisibleChange"></add-user-dialog>
    <edit-user-dialog :editUserDialogVisible="editUserDialogVisible" :formRow="form" @editDialogVisibleChange="editDialogVisibleChange"
                     @editSuccessVisibleChange="editSuccessVisibleChange"></edit-user-dialog>
    <user-detail-dialog :detailDialogVisible="detailDialogVisible" :formRow="form" @detailDialogVisibleChange="detailDialogVisibleChange"></user-detail-dialog>

  </div>
</template>

<script>
import request from "@/plugins/request";
import {CirclePlusFilled, DeleteFilled} from '@element-plus/icons-vue'
import AddUserDialog from "@/components/AddUserDialog";
import EditUserDialog from "@/components/EditUserDialog";
import UserDetailDialog from "@/components/UserDetailDialog";

export default {
  name: "Employee",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: '',
      small: false,
      background: false,
      disabled: false,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      detailDialogVisible:false,
      deleteButtonShow: true,
      loading:true,
      form:{},
    }
  },
  components: {
    UserDetailDialog,
    AddUserDialog,
    EditUserDialog,
    CirclePlusFilled,
    DeleteFilled
  },

  methods: {
    loadData() {
      this.loading = true
      request.get('/employee',{
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          search:this.search
        }
      }).then(res => {
        console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    handleDetail(row) {
      console.log("这一行",row)
      this.form = JSON.parse(JSON.stringify(row))
      this.detailDialogVisible = true
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.editUserDialogVisible = true
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
    addDialogVisibleChange(val) {
      this.addUserDialogVisible = val
    },
    addSuccessVisibleChange(val) {
      this.addUserDialogVisible = val
      this.loadData()
    },
    editDialogVisibleChange(val) {
      this.editUserDialogVisible = val
    },
    editSuccessVisibleChange(val) {
      this.editUserDialogVisible = val
      this.loadData()
    },
    detailDialogVisibleChange(val) {
      this.detailDialogVisible = val
    },
    handleSelectionChange(val) {
      console.log("val", val) // proxy包裹的数据
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      console.log("ms", this.multipleSelection)
      this.deleteButtonShow = this.multipleSelection.length <= 0;
    },
    deleteUser() {
      this.$confirm('此操作将永久删除所选人员信息，是否继续？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(async ()=>{
        for (let i = 0; i < this.multipleSelection.length; i++) {
          await request.delete('/employee/' + this.multipleSelection[i].userId).then(res => {
            console.log(res)
            if (res["code"] === 1) {
              this.$message({
                message:res.data,
                type:'success'
              })
            }
            else {
              this.$message({
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
  },
}

</script>

<style scoped>
.button-group {
  padding: 15px;
}
</style>