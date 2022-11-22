<template>
  <router-view/>
</template>

<script>

export default {
  name: "App",
  components: {
  },
  created() {
    this.$router.push('/employee')
  }
}
</script>

<style>

</style>
