<template>
    <router-view/>
</template>

<script>

export default {
  name: "App",
  components: {
  },
  created() {
    this.$router.push('/login') // 这里一定程度能登录拦截
  }
}
</script>

<style>

</style>
