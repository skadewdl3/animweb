<script setup lang="ts">
import { onMounted } from 'vue'
import { editor } from '@reactives/editor.ts'

onMounted(() => {
  editor.create()
  if (window) {
    import('./../core/main.ts').then(module => {
      module.default()
      // @ts-ignore
      if (window.WebAnim) {
        console.log('ready')
        editor.disabled = false
      }
    })
  }
})

onUnmounted(() => {
  console.log('this ran')
  window.WebAnim.destroyScenes()
})
</script>

<template>
  <Head>
    <Title>Animweb - Start creating your animation now!</Title>
  </Head>
  <Controls :disabled="editor.disabled" />
  <Interactables :disabled="editor.disabled" />
</template>

<style lang="stylus">
</style>
