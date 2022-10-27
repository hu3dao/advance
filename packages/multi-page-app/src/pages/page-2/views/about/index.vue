<script lang='ts' setup>
  import {useRouter} from 'vue-router'
  import {Dialog} from 'vant'
  const router = useRouter()
  const back = () => {
    router.back()
  }
  const show = () => {
    Dialog.alert({
      title: '标题',
      message: '代码是写出来给人看的，附带能在机器上运行。',
    }).then(() => {
      // on close
    });
  }
</script>

<template>
  about
  <button @click="back">back</button>
  <VanButton type="success" @click="show">显示</VanButton>
</template>

<style scoped>
</style>