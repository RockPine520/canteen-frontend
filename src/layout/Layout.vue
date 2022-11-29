<template>
  <div>
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
<!--        <router-view/>-->
        <router-view v-slot="{Component}">
          <transition name="fade" mode="out-in" :duration="{ enter: 100, leave: 100 }">
            <component :is="Component"/>
          </transition>
        </router-view>
      </el-col>

    </el-row>
  </div>

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>