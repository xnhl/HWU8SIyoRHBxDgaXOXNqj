<template>
  <div>
  </div>
</template>

<script>
export default {
  mounted() { setTimeout(() => { this.$router.go(-1) }, 500) }
}
</script>

<style lang="sass"></style>
