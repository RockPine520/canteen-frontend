<template>
签到表
  <el-input v-model="search" placeholder="请输入关键字" style="width: 20%"></el-input>
</template>

<script>
export default {
  name: "Sign",
  data(){
    return{
      search:'',
    }
  }
}
</script>

<style scoped>

</style>