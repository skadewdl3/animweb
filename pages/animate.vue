<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { editor } from '@reactives/editor.ts'

const disabled = ref(true)

onMounted(() => {
  editor.create()
  if (window) {
    import('./../core/main.ts').then(module => {
      module.default()
      // @ts-ignore
      if (window.WebAnim) {
        console.log('ready')
        disabled.value = false
      }
    })
  }
})
</script>

<template>
  <Controls :disabled="disabled" />
  <Interactables :disabled="disabled" />
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
