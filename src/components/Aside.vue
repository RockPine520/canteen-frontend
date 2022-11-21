<template>
  <div>
    <el-menu
        default-active="employee"
        class="el-menu-vertical-demo"
        style="min-height: calc(100vh - 50px)"
        router
    >
      <el-menu-item index="employee">
        <el-icon><icon-menu /></el-icon>
        <span>人员列表</span>
      </el-menu-item>
      <el-menu-item index="device">
        <el-icon><setting /></el-icon>
        <span>设备列表</span>
      </el-menu-item>
      <el-menu-item index="sign">
        <el-icon><setting /></el-icon>
        <span>签到列表</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

</script>

<style scoped>

</style>