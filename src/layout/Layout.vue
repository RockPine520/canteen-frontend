<template>
  <div class="common-layout">
    <el-container>
      <el-header style=" height:8vh; border-bottom: 1px solid #ccc;">
        <Header></Header>
      </el-header>
      <el-container style="height: 92vh">
        <el-aside width="12vw">
          <Aside></Aside>
        </el-aside>
        <el-main>
          <router-view v-slot="{Component}">
            <transition name="fade" mode="out-in" :duration="{ enter: 100, leave: 100 }">
              <component :is="Component"/>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
<!--    <el-row>-->
<!--      <el-col :span="24">-->
<!--        <Header></Header>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row>-->
<!--      <el-col :span="3">-->
<!--        <Aside></Aside>-->
<!--      </el-col>-->
<!--      <el-col :span="21">-->
<!--&lt;!&ndash;        <router-view/>&ndash;&gt;-->
<!--        <router-view v-slot="{Component}">-->
<!--          <transition name="fade" mode="out-in" :duration="{ enter: 100, leave: 100 }">-->
<!--            <component :is="Component"/>-->
<!--          </transition>-->
<!--        </router-view>-->
<!--      </el-col>-->
<!--    </el-row>-->
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
.allPage{
  height: 100vh;
}
</style>