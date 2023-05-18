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
</script>

<template>
  <Head>
    <Title>Animweb - Start creating your animation now!</Title>
  </Head>
  <Controls :disabled="editor.disabled" />
  <Interactables :disabled="editor.disabled" />
</template>

<style lang="stylus">
*
  box-sizing border-box
  margin 0
  padding 0
  border 0
  outline none!important

html
  font-size 10px;

body
  font-size inherit;
  font-family sans-serif

</style>
