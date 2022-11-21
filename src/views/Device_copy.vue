<template>
  <div>
    <div class="button-group">
      <el-button type="primary">
        <el-icon style="margin-right:3px">
          <CirclePlusFilled/>
        </el-icon>
        新增
      </el-button>
      <el-button type="danger">
        <el-icon style="margin-right:3px">
          <DeleteFilled/>
        </el-icon>
        删除
      </el-button>
    </div>
    <el-table :data="tableData"
              stripe
              style="width: 100%"
              @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column sortable prop="device_num" label="设备号" align="center"/>
      <el-table-column prop="is_online" label="是否在线" align="center"/>
      <el-table-column prop="device_name" label="设备名称" align="center"/>
      <el-table-column prop="device_group" label="设备组" align="center"/>
      <el-table-column fixed="right" label="操作" width="350" align="center">
        <template #default>
          <el-button link type="primary" size="small" @click="sendFormVisible=true">下发用户</el-button>
          <el-button link type="primary" size="small" @click="handleClick">已下发用户列表</el-button>
          <el-button link type="primary" size="small">设备设置</el-button>
          <el-button link type="primary" size="small">识别记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--下发功能-->
    <el-dialog
        v-model="sendFormVisible"
        title="选择用户下发"
        width="50%"
        :before-close="handleSendFormClose"
    >
      <el-table :data="userData"
                stripe
      >
        <el-table-column
            type="selection"
            width="30">
        </el-table-column>
        <el-table-column sortable prop="id" label="员工ID" align="center"/>
        <el-table-column prop="name" label="姓名" align="center"/>
        <el-table-column prop="id_valid" label="员工有效期" align="center"/>
        <el-table-column prop="group" label="员工组" align="center"/>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sendFormVisible = false">取消</el-button>
          <el-button type="primary" @click="sendToDevice">
            下发
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/plugins/request";
import {CirclePlusFilled, Promotion, DeleteFilled} from '@element-plus/icons-vue'

export default {
  name: "Device",
  data() {
    return {
      tableData: [
        {
          device_num: "ET66929",
          is_online: "在线",
          device_name: "山明",
          device_group: "山明",
        },
        {
          device_num: "BT1001",
          is_online: "在线",
          device_name: "益新",
          device_group: "益新",
        },
      ],
      multipleSelection: [],
      sendFormVisible: false,
      userData:[]
    }
  },
  components: {
    CirclePlusFilled, Promotion, DeleteFilled
  },

  methods: {
    handleClick() {
      console.log("点我")
    },
    openSendForm() {

    },
    handleSendFormClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    sendToDevice() {

    },

    handleSelectionChange(val) {
      console.log(val) // proxy包裹的数据
      const _val = JSON.parse(JSON.stringify(val))
      console.log(_val)
      this.multipleSelection = _val
      console.log(this.multipleSelection)
    }
  },
  created() {
    request.get('/employee/all').then(res => {
      // console.log(res)
      this.userData = res.data;
    })
  },
}

</script>

<style scoped>
.button-group {
  padding: 15px;
}
</style>