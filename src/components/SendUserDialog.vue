<template>
  <el-dialog
      v-model="dialogVisible"
      title="选择用户下发"
      width="50%"
      :before-close="handleDialogClose"
      @close="closeDialog"
  >
    <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="userData"
        stripe
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="30">
      </el-table-column>
      <el-table-column sortable prop="userId" label="员工ID" align="center" width="100"/>
      <el-table-column prop="name" label="姓名" align="center" width="100"/>
      <el-table-column prop="idValid" label="员工有效期" align="center" width="180"/>
      <el-table-column prop="group" label="员工组" align="center"/>
      <el-table-column prop="send_device" label="已下发设备列表" align="center"/>
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
  props: ['sendDialogVisible'],
  data() {
    return {
      dialogVisible: this.sendDialogVisible,
      userData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: '',
      small: false,
      disabled: false,
      background: false,
      loading: false
    }
  },
  watch: {
    sendDialogVisible(newVal) {
      this.dialogVisible = newVal
    }
  },
  methods: {
    loadData() {
      this.loading = true
      request.get('/employee', {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res => {
        this.loading = false
        this.userData = res.data.records;
        this.total = res.data.total
      })
    },
    closeDialog() {
      this.$emit("dialogVisibleChange", false)
      this.$refs.multipleTable.clearSelection();
    },
    handleDialogClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
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
    sendToDevice() {
      // const multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
      // console.log("ms", this.multipleSelection)
      // console.log("id",multipleSelection[0]["userId"])
      // 不能用forEach，不支持异步
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let value = this.multipleSelection[i]["userId"]
        request.get('/employee/getEmployeeById/' + value).then(res => {
          console.log(res)
          this.$message({
            message: '下发成功',
            type: 'success'
          })

        }).catch(err => {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }
    },
  },
  created() {
    this.loadData()
  },

}
</script>

<style scoped>

</style>