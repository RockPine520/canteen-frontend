<template>
<!--  <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #ccc; display: flex;">-->
<!--    <div style="width: 200px; padding-left: 30px; font-weight: bold; color: dodgerblue">食堂后台管理平台</div>-->
<!--    <div style="flex:1">-->

<!--    </div>-->
<!--    <div style="width: 100px;">-->
<!--      <el-button type="text" style="color: var(&#45;&#45;el-color-primary)" @click="quit">退出</el-button>-->
<!--    </div>-->
<!--  </div>-->
  <div class="header">
    <div class="header-left">食堂后台管理平台</div>
    <div class="header-center"></div>
    <div class="header-right">
      <el-button type="text" style="color: var(--el-color-primary)" @click="quit">退出</el-button>
    </div>
  </div>
</template>

<script> //setup 组合式API，不用手动return暴露方法或属性
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  components:{ArrowDown},
  data(){
    return {
      value:true
    }
  },
  methods:{
    quit(){
      this.$router.push('/login')
    },
  }
}

</script>

<style scoped>
.header {
  height: 100%;
  display: flex;
}
.header-left {
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: large;
  color: dodgerblue;
}
.header-center {
  flex: 1;
}
.header-right {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

