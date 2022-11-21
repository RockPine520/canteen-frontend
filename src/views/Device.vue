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
              v-loading="loading"
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
          <el-button link type="primary" size="small" @click="sendDialogVisible=true">下发用户</el-button>
          <el-button link type="primary" size="small" @click="handleClick">已下发用户列表</el-button>
          <el-button link type="primary" size="small">设备设置</el-button>
          <el-button link type="primary" size="small">识别记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--下发功能-->
    <send-user-dialog :sendDialogVisible="sendDialogVisible" @dialogVisibleChange="dialogVisibleChange"></send-user-dialog>
  </div>
</template>

<script>
import {CirclePlusFilled, Promotion, DeleteFilled} from '@element-plus/icons-vue'
import SendUserDialog from "@/components/SendUserDialog";
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
      sendDialogVisible: false,
      userData:[],
      loading:false
    }
  },
  components: {
    CirclePlusFilled, Promotion, DeleteFilled,SendUserDialog
  },

  methods: {
    handleClick() {
      console.log("点我")
    },

    dialogVisibleChange(val) {
      this.sendDialogVisible = val
    },

    handleSelectionChange(val) {
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      console.log(this.multipleSelection)
    }
  },
  created() {
  },
}

</script>

<style scoped>
.button-group {
  padding: 15px;
}
</style>