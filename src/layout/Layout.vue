<template>
  <el-row>
    <el-col :span="24">
      <Header></Header>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="3">
      <Aside></Aside>
    </el-col>
    <el-col :span="21">
      <router-view/>
    </el-col>
  </el-row>

</template>

<script>
import Header from "@/components/Header";
import Aside from "@/components/Aside";

export default {
  name: "Layout",
  components: {
    Header,
    Aside
  }
}
</script>

<style scoped>

</style>