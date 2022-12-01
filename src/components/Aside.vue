<template>
  <div>
    <el-menu
        :default-active="path"
        class="el-menu-vertical-demo"
        style="min-height: calc(100vh - 50px)"
        router
    >
      <el-menu-item index="/empgroup">
        <el-icon><HomeFilled /></el-icon>
        <span>部门列表</span>
      </el-menu-item>
      <el-menu-item index="/employee">
        <el-icon><UserFilled /></el-icon>
        <span>人员列表</span>
      </el-menu-item>
      <el-menu-item index="/device">
        <el-icon><Tools /></el-icon>
        <span>设备列表</span>
      </el-menu-item>
      <el-menu-item index="/sign">
        <el-icon><Checked /></el-icon>
        <span>签到管理</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
import {Tools, UserFilled, HomeFilled, Checked} from '@element-plus/icons-vue'
export default {
  name:"Aside",
  components:{
    Tools, UserFilled, HomeFilled, Checked
  },
  data(){
    return {
      path:this.$route.path
    }
  },
  created() {
    console.log("path",this.path)
  }
}

</script>

<style scoped>

</style>