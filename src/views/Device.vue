<template>
  <div>
    <div class="button-group">
      <el-button type="primary" @click="openAddDialog">
        <el-icon style="margin-right:3px">
          <CirclePlusFilled/>
        </el-icon>
        新增
      </el-button>
      <el-button type="danger" :disabled="deleteButtonShow" @click="deleteDevice">
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
    <el-table :data="tableData"
              v-loading="loading"
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="55"
          fixed="left"
      >
      </el-table-column>
      <el-table-column sortable prop="devName" label="设备编号" align="center"/>
<!--      <el-table-column prop="is_online" label="是否在线" align="center"/>-->
<!--      <el-table-column prop="device_nickname" label="设备名称" align="center"/>-->
      <el-table-column prop="departmentName" label="部门名称" align="center"/>
      <el-table-column fixed="right" label="操作" width="350" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small"
                     @click="handleSend(scope.row)">下发用户
          </el-button>
          <el-button link type="primary" size="small" @click="openSendUser(scope.row)">已下发用户列表</el-button>
          <el-button link type="primary" size="small">设备设置</el-button>
          <el-button link type="primary" size="small" @click="deviceEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    新增设备-->
    <el-dialog
        v-model="addDialogVisible"
        title="新增设备信息"
        width="30%"
        :before-close="addClose"
    >
      <el-form :model="form" :rules="rules" ref="addFormRef" label-width="100px" :label-position='labelPosition'>
        <el-form-item label="设备编号" prop="devName">
          <el-input v-model="form.devName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="部门名称" prop="depId">
          <el-select v-model="form.depId" placeholder="请选择" style="width: 90%">
            <el-option
                v-for="item in depOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button @click="addDialogClose('addFormRef')">取消</el-button>-->
        <!--          <el-button type="primary" @click="addSave('addFormRef')">保存</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogClose('addFormRef')">取消</el-button>
          <el-button type="primary" @click="addSave('addFormRef')">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    编辑设备-->
    <el-dialog
        v-model="editDialogVisible"
        title="编辑设备信息"
        width="30%"
        :before-close="editClose"
    >
      <el-form :model="form" :rules="rules" ref="editFormRef" label-width="100px" :label-position='labelPosition'>
        <el-form-item label="设备编号" prop="devName">
          <el-input v-model="form.devName" style="width: 90%"/>
        </el-form-item>
        <el-form-item label="部门名称" prop="depId">
          <el-select v-model="form.depId" placeholder="请选择" style="width: 90%" :disabled="isAble">
            <el-option
                v-for="item in depOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button @click="editDialogClose('editFormRef')">取消</el-button>-->
        <!--          <el-button type="primary" @click="editSave('editFormRef')">保存</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogClose('editFormRef')">取消</el-button>
          <el-button type="primary" @click="editSave('editFormRef')">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <!--下发功能-->
    <send-user-dialog :sendDialogVisible="sendDialogVisible" :formRow="form"
                      @dialogVisibleChange="dialogVisibleChange"></send-user-dialog>
    <!--    已下发员工列表-->
    <el-dialog
        v-model="userDialogVisible"
        :title="'【'+rowDevName+'】已下发员工列表'"
        width="50%"
        :before-close="userClose"
    >
      <div style="margin-left: 15px">
        <el-input v-model="userSearch" placeholder="请输入关键字" style="width: 30%" clearable></el-input>
        <el-button type="primary" style="margin-left: 5px" @click="loadUserData">查询</el-button>
        <el-button type="danger" :disabled="userDeleteButtonShow" @click="deleteSendUser"
                   style="float: right; margin-right: 15px">
          <el-icon style="margin-right:3px">
            <DeleteFilled/>
          </el-icon>
          从下发设备中删除
        </el-button>
      </div>

      <el-table :data="userData"
                v-loading="userLoading"
                stripe
                style="width: 100%"
                @selection-change="userSelectionChange"
                max-height="300"
      >
        <el-table-column
            type="selection"
            width="30">
        </el-table-column>
        <el-table-column sortable prop="userId" label="员工ID" align="center"/>
        <el-table-column prop="name" label="姓名" align="center"/>
        <el-table-column prop="departmentName" label="员工部门" align="center"/>
        <el-table-column prop="isDistributed" label="下发状态" align="center" :formatter="statusFormat">
          <template #default="scope">
            <el-tag v-if="scope.row.isDistributed===0" type="warning">未下发</el-tag>
            <el-tag v-else-if="scope.row.isDistributed===1" type="success">已下发</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleUserDetail(scope.row)">用户详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
            :current-page="userCurrentPage"
            :page-size="userPageSize"
            :page-sizes="[10, 50, 100]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userTotal"
            @size-change="userSizeChange"
            @current-change="userCurrentChange"
        />
      </div>
    </el-dialog>
    <!--    用户详情-->
    <user-detail-dialog :detailDialogVisible="detailDialogVisible" :formRow="userForm"
                        @detailDialogVisibleChange="detailDialogVisibleChange"></user-detail-dialog>
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
  </div>
</template>

<script>
import {CirclePlusFilled, DeleteFilled, Promotion} from '@element-plus/icons-vue'
import SendUserDialog from "@/components/SendUserDialog";
import UserDetailDialog from "@/components/UserDetailDialog";
import request from "@/plugins/request";

export default {
  name: "Device",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      userMultipleSelection: [],
      sendDialogVisible: false,
      userData: [],
      loading: true,
      userLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      userDialogVisible: false,
      detailDialogVisible: false,
      form: {
        devName: '',
        devId: ''
      },
      userForm: {},
      labelPosition: 'right',
      rules: {
        devName: [
          {required: true, message: "请输入设备编号", trigger: 'blur'},
        ],
        depId: [
          {required: true, message: "请选择设备所在部门", trigger: 'change'}
        ]
      },
      deleteButtonShow: true,
      userDeleteButtonShow: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      small: false,
      background: false,
      disabled: false,
      search: '',
      depOptions: [],
      rowDevName: '',
      rowDevId: -1,
      userCurrentPage:1,
      userPageSize:10,
      userTotal:0,
      userSearch:'',
      isAble:false
    }
  },
  components: {
    CirclePlusFilled, Promotion, DeleteFilled, SendUserDialog, UserDetailDialog
  },

  methods: {
    detailDialogVisibleChange(val) {
      this.detailDialogVisible = val
    },
    handleUserDetail(row) {
      console.log("调用用户详情接口")
      this.userForm = JSON.parse(JSON.stringify(row))
      this.detailDialogVisible = true
    },
    userSelectionChange(val) {
      this.userMultipleSelection = JSON.parse(JSON.stringify(val))
      this.userDeleteButtonShow = this.userMultipleSelection.length <= 0;
    },
    deleteSendUser() {
      let ids = []
      for (let i = 0; i < this.userMultipleSelection.length; i++) {
        let temp = []
        temp.push(this.userMultipleSelection[i].userId)
        temp.push(this.rowDevId)
        ids.push(temp)
      }
      console.log("ids", ids)
      this.$confirm('此操作会将所选人员从设备中删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.userLoading = true
        await request.post('/employee/delsEmp', ids).then(res => {
          console.log("1",res)
          if (res.code===1) {
            this.$message({
              message: "删除成功",
              type: 'success'
            })
          }else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
          this.userLoading = false
          this.loadUserData()
        }).catch(err=>{
          this.$message({
            message: err,
            type: 'error'
          })
          this.loadUserData() //这里有异步的问题，后端先解决
          this.userLoading = false
        })
      })

    },
    statusFormat(row) {
      if (row.isDistributed === 0) {
        return '未下发'
      } else if (row.isDistributed === 1) {
        return '已下发'
      } else return '未知'
    },
    openSendUser(row) {
      this.userDialogVisible = true
      this.rowDevName = row.devName
      this.rowDevId = row.devId
      this.loadUserData()
    },
    loadUserData(){
      this.userLoading = true
      //分页查询
      request.get('/device/getEmpPageByDevId', {
        params:{
          pageNum:this.userCurrentPage,
          pageSize:this.userPageSize,
          search:this.userSearch,
          devId:this.rowDevId
        }
      }).then(res => {
        console.log("res1",res)
        if (res.data){
          this.userData = res.data.records
          this.userTotal = res.data.total
        } else {
          this.userData=[]
          this.userTotal = 0
        }
        this.userLoading = false
      })
    },
    loadData() {
      this.loading = true
      console.log("调用查询设备接口")
      request.get('/device', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        console.log("dvres",res)
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
      })
      request.get('/department/all').then(res => {
        this.depOptions = res.data.map(item => {
          return {value: item.depId, label: item.depName}
        })
      })

    },
    handleClick() {
      console.log("点我")
    },
    handleSend(row) {
      console.log("row", row)
      this.sendDialogVisible = true;
      this.form = JSON.parse(JSON.stringify(row))
    },

    dialogVisibleChange(val) {
      this.sendDialogVisible = val
      this.form = {}
    },

    handleSelectionChange(val) {
      console.log("val", val) // proxy包裹的数据
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      console.log("ms", this.multipleSelection)
      this.deleteButtonShow = this.multipleSelection.length <= 0;
    },
    openAddDialog() {
      this.addDialogVisible = true
      this.$nextTick(() => {
        this.$refs.addFormRef.resetFields()
      })
    },
    addClose() {
      this.form = {}
      this.addDialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    editClose() {
      this.form = {}
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    userClose() {
      this.userDialogVisible = false
    },
    addDialogClose(formName) {
      this.form = {}
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    editDialogClose(formName) {
      this.form = {}
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    async addSave(formName) {
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("调用新增设备接口")
          console.log("add", this.form)
          request.post("/device/addDev", this.form).then(res => {
            console.log("addres", res)
            if (res["code"] === 1) {
              this.$message({
                message: res.data,
                type: 'success'
              })
              this.addDialogClose(formName)
              this.loadData()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
          // this.addDialogClose(formName)
        } else {
          console.log("新增校验失败")
        }
      })
    },
    async editSave(formName) {
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("调用编辑设备接口")
          console.log("edit", this.form)
          let sForm = JSON.parse(JSON.stringify(this.form))
          delete sForm.departmentName
          console.log("edit2", sForm)
          request.post('/device/editWithDep', sForm).then(res => {
            console.log("eres", res)
            if (res["code"] === 1) {
              this.$message({
                message: res.data,
                type: 'success'
              })
              this.editDialogClose(formName)
              this.loadData()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          console.log("编辑校验失败")
        }
      })
    },
    deleteDevice() {
      this.$confirm('此操作将永久删除设备信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          await request.post('/device/delDev', this.multipleSelection[i]).then(res => {
            console.log(res)
            if (res["code"] === 1) {
              this.$message({
                message: res.data,
                type: 'success'
              })
            } else {
              this.$message.error({
                message: res.msg
              })
            }
          })
        }
        this.loadData()
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
    userSizeChange(val){
      this.userPageSize = val
      this.loadUserData()
    },
    userCurrentChange(val){
      this.userCurrentPage = val
      this.loadUserData()
    },
    deviceEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
      request.get('/device/getEmpByDevId/'+row.devId).then(res=>{
        this.isAble = res.data !== null;
      })
    }
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