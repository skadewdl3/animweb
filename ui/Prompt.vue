<script setup lang="ts">
import { Prompt } from '@mixins/Prompt.ts';
import { onMounted } from 'vue';
// @ts-ignore
import { SendOutlined as SubmitIcon } from '@ant-design/icons-vue'


const props = defineProps({
  prompt: {
    type: Prompt,
    required: true
  }
})

onMounted(() => {
  props.prompt.updateElement()
})

</script>


<template>
  <div :id="prompt.id" :class="prompt.id" class="user-prompt-container"
    :style="{ top: `${prompt.y}px`, left: `${prompt.x}px` }">
    <div class="user-prompt-title-container">
      <div class="user-prompt-title">{{ prompt.title }}</div>
      <button class="user-button user-prompt-submit-btn"><SubmitIcon /></button>
    </div>
    <div class="user-prompt-description">{{ prompt.description }}</div>
    <input class="user-prompt-input" type="text" :placeholder="prompt.placeholder || ''" :defaultValue="prompt.value || ''">
  </div>
</template>

<style lang="stylus">
.user-prompt

  &-container
    background #fff
    border solid 0.1rem #ccc
    border-radius 0.5rem
    padding 1rem
    position absolute

  &-title-container
    display flex
    justify-content space-between
    align-items center
    margin-bottom 0.5rem

  &-title
    font-size 2 rem
    font-weight 600
    margin-bottom 0.5rem

  &-description
    max-width 80rem
    min-width 30rem
    font-size 1.5rem
    margin-bottom 1rem

  &-input
    width 100%
    padding 0.5rem 1rem
    border-radius 0.5rem
    border solid 0.1rem #ccc
    font-size 1.5rem
</style>