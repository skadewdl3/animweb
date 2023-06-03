<script setup lang="ts">
import { Button } from '@mixins/Button.ts';
import { onMounted } from 'vue';

const props: {
  button: Button
} = defineProps({
  button: {
    type: Button,
    required: true
  }
})

onMounted(() => {
  props.button.updateElement()
})
</script>

<template>
  <div :id="props.button.id" :class="props.button.id" class="user-button-container"
    :style="{ top: `${props.button.y}px`, left: `${props.button.x}px` }">
    <button class="user-button">{{ props.button.text }}</button>
  </div>
</template>

<style lang="stylus">
.user-button-container
  position absolute

.user-button
  padding 0.5rem 1rem
  font-size 1.6rem
  border-radius 0.5rem
  background primary_color
  border solid 0.1rem primary_color
  color #fff
  cursor pointer
  transition all .2s ease-in-out
  white-space nowrap
  &:hover
    color primary_color
    background #fff
  &:active
    transition transform .1s ease-in-out
    transform translateY(0.2rem)
</style>