<script lang='ts' setup>
  import {useRouter} from 'vue-router'
  const router = useRouter()
  const back = () => {
    router.back()
  }
</script>

<template>
  about
  <button @click="back">back</button>
</template>

<style scoped>
</style>