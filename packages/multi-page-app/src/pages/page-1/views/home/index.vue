<script lang='ts' setup>
// import {useRouter} from 'vue-router'
const router = useRouter()
const goAbout = () => {
  router.push('/about')
}
</script>

<template>
  home11
  <button @click="goAbout">go about</button>
</template>

<style scoped>
</style>