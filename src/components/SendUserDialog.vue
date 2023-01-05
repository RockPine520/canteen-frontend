<template>
  <el-dialog
      v-model="dialogVisible"
      title="选择用户下发"
      width="55%"
      :before-close="handleDialogClose"
      @close="closeDialog"
  >
    <div style="margin-left: 15px">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadData">查询</el-button>
    </div>
    <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="userData"
        stripe
        @selection-change="handleSelectionChange"
        max-height="300"
        @filter-change="filterChange"
    >
      <el-table-column
          type="selection"
          width="30">
      </el-table-column>
      <el-table-column sortable prop="userId" label="员工ID" align="center" width="100"/>
      <el-table-column prop="name" label="姓名" align="center" width="100"/>
      <el-table-column prop="idValid" label="员工有效期" align="center" width="180"/>
      <el-table-column prop="departmentName" label="员工部门" align="center"/>
      <el-table-column prop="proName" label="员工种类" align="center"/>
      <el-table-column prop="isOnThisDevice" label="是否已下发到该设备" align="center"
                       :filters="[{text:'已下发',value:1},{text:'未下发',value: 0}]"
                       filter-placement="bottom-end"
                       column-key="filterDevTag"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.isOnThisDevice===true" type="success">已下发</el-tag>
          <el-tag v-else-if="scope.row.isOnThisDevice===false" type="warning">未下发</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="faceTemplate" label="是否上传照片" align="center"
                       :filters="[{text:'已上传',value:1},{text:'未上传',value: 0}]"
                       filter-placement="bottom-end"
                       column-key="filterPicTag"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.faceTemplate.length!==0" type="success">已上传</el-tag>
          <el-tag v-else-if="scope.row.faceTemplate.length===0" type="danger">未上传</el-tag>
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
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sendToDevice">
            下发
          </el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script>
import request from "@/plugins/request";

export default {
  name: "SendUserDialog",
  props: ['sendDialogVisible', 'formRow'],
  data() {
    return {
      dialogVisible: this.sendDialogVisible,
      form: this.formRow,
      userData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: '',
      small: false,
      disabled: false,
      background: false,
      loading: false,
      aFilter:undefined,
      bFilter:undefined
    }
  },
  watch: {
    sendDialogVisible(newVal) {
      this.dialogVisible = newVal
    },
    formRow(newVal) {
      this.form = newVal
      this.loadData()
    }
  },
  methods: {
    filterChange(filters){
      this.aFilter = filters.filterDevTag
      this.bFilter = filters.filterPicTag
      this.loadData()
    },
    filterOnDevice(value,row){
      return row.isOnThisDevice === value
    },
    loadData() {
      this.loading = true
      let aStatus=''
      let bStatus=''
      if (this.aFilter!==undefined) aStatus = this.aFilter.join(",")
      if (this.bFilter!==undefined) bStatus = this.bFilter.join(",")
      console.log("aStatus",aStatus)
      console.log("bStatus",bStatus)
      request.get('/employee/findByDepIdS', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search,
          depId: this.form.depId,
          devId: this.form.devId,
          statusDev:aStatus,
          statusPic:bStatus,
        }
      }).then(res => {
        this.loading = false
        this.userData = res.data.records
        this.total = res.data.total
        console.log("userData",this.userData)
      })

    },
    closeDialog() {
      this.$emit("dialogVisibleChange", false)
      this.$refs.multipleTable.clearSelection()
    },
    handleDialogClose() {
      this.dialogVisible = false
    },
    handleSelectionChange(val) {
      // console.log(val) // proxy包裹的数据
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      console.log(this.multipleSelection)

    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadData()
    },
    async sendToDevice() {
      // 不能用forEach，不支持异步
      // this.form.depId
      this.loading = true
      for (let i = 0; i < this.multipleSelection.length; i++) {
        // let value = this.multipleSelection[i]["userId"]
        let jsonValue = {
          userId: this.multipleSelection[i]["userId"],
          devId: this.form.devId
        }
        console.log("下发",jsonValue)
        await request.post('/employee/getEmployeeById', jsonValue).then(res => {
          console.log(res)
          if (res.code === 1) {
            this.$message({
              // message: '下发人员【'+this.multipleSelection[i]["userId"]+'】成功',
              message: res.data,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            // message: err,
            message: '响应超时，请确认该员工的下发设备是否已连接',
            type: 'error'
          })
        })
      }
      this.loadData()
      this.loading = false
    },
  },
  created() {

  },

}
</script>

<style scoped>

</style>