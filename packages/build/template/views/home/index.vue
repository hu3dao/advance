<script lang='ts' setup>
// import {useRouter} from 'vue-router'
const router = useRouter()
const goAbout = () => {
  router.push('/about')
}
</script>

<template>
  <h1>home11</h1>
  <van-button type="primary" @click="goAbout">go about</van-button>
</template>

<style lang="scss" scoped>
$color: #f90;
h1 {
  color: $color;
}
</style>