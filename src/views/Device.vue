<template>
  <div>
    <div class="button-group">
      <el-button type="primary" @click="addDialogVisible=true">
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
          width="55">
      </el-table-column>
      <el-table-column sortable prop="devName" label="设备编号" align="center"/>
      <el-table-column prop="is_online" label="是否在线" align="center"/>
      <el-table-column prop="device_nickname" label="设备名称" align="center"/>
      <el-table-column prop="departmentName" label="部门名称" align="center"/>
      <el-table-column fixed="right" label="操作" width="350" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small"
                     @click="handleSend(scope.row)">下发用户
          </el-button>
          <el-button link type="primary" size="small" @click="handleClick">已下发用户列表</el-button>
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
</template>

<script>
import {CirclePlusFilled, DeleteFilled, Promotion} from '@element-plus/icons-vue'
import SendUserDialog from "@/components/SendUserDialog";
import request from "@/plugins/request";

export default {
  name: "Device",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      sendDialogVisible: false,
      userData: [],
      loading: true,
      addDialogVisible: false,
      editDialogVisible: false,
      form: {},
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
      small: false,
      background: false,
      disabled: false,
      search: '',
      depOptions: [],
    }
  },
  components: {
    CirclePlusFilled, Promotion, DeleteFilled, SendUserDialog
  },

  methods: {
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
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
      })
      request.get('/department/all').then(res => {
        this.depOptions = res.data.map(item => {
          return {value: item.depId, label: item.depName}
        })
      })
      // this.tableData = [
      //   {
      //     deviceName: "ET66929",
      //     is_online: "在线",
      //     device_nickname: "山明",
      //     device_group: "山明",
      //   },
      //   {
      //     deviceName: "BT1001",
      //     is_online: "在线",
      //     device_nickname: "益新",
      //     device_group: "益新",
      //   },
      // ]

    },
    handleClick() {
      console.log("点我")
    },
    handleSend(row){
      console.log("row",row)
      this.sendDialogVisible=true;
      this.form = JSON.parse(JSON.stringify(row))
    },

    dialogVisibleChange(val) {
      this.sendDialogVisible = val
    },

    handleSelectionChange(val) {
      console.log("val", val) // proxy包裹的数据
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      console.log("ms", this.multipleSelection)
      this.deleteButtonShow = this.multipleSelection.length <= 0;
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
          request.post('/device/editWithDep', this.form).then(res => {
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
    deviceEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.editDialogVisible = true
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