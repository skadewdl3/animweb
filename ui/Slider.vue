<script setup lang="ts">
import { Slider } from '@mixins/Slider.ts';
import { onMounted } from 'vue';


const props = defineProps({
  slider: {
    type: Slider,
    required: true
  }
})

onMounted(() => {
  props.slider.updateElement()
})
</script>

<template>
  <div :id="slider.id" :class="slider.id" class="slider" :style="{ top: `${slider.y}px`, left: `${slider.x}px` }">
    <div class="slider-input-container">
      <input type="range" class="slider-bar" :min="slider.min" :max="slider.max" :step="slider.step"
        :value="slider.value">
      <input type="text" class="slider-textbox">
    </div>
    <div class="slider-title-container">
      <span class="slider-title">{{ slider.title }}</span>
    </div>
  </div>
</template>

<style lang="stylus">
.slider
  position absolute
  background #fff
  border solid 0.1rem #ccc
  border-radius 0.5rem
  padding 0.5rem 1rem
  max-height 8rem
  height 8rem
  display flex
  flex-direction column
  justify-content center
  align-items center
  input[type='range']
    -webkit-appearance none
    appearance none
    background transparent
    cursor pointer
    margin-top 1rem
  input[type='text']
    width 4rem
    margin 0 0.5rem
    margin-top 1rem
    border solid 0.1rem #ccc
    border-radius 0.5rem
    padding 0.5rem
    -moz-appearance textfield
    appearance textfield
    text-align center
  .slider-title-container
    text-align center
  .slider-title
    font-size 1.3rem
    color rgba(0, 0, 0, 0.8)
  input
    &::-webkit-slider-runnable-track
      background #ccc
      height 0.5rem
      border-radius 0.1rem
    &::-moz-range-track
      background #ccc
      height 0.5rem
      border-radius 0.1rem
    &::-webkit-slider-thumb
      -webkit-appearance none
      appearance none
      margin-top -0.75rem
      background-color #fff
      height 2rem
      width 2rem
      border-radius 1rem
      border solid 0.1rem #aaa
    &::-moz-range-thumb
      border none
      border-radius 0
      background-color #fff
      height 2rem
      width 2rem
      border solid 0.1rem #aaa
      border-radius 1rem

.slider input[type='number']::-webkit-outer-spin-button,
.slider input[type='number']::-webkit-inner-spin-button
  -webkit-appearance none
  margin 0

.slider-input-container
  display flex
  align-items center

.slider-separator
  width 100%
  height 0.1rem
  background #ccc
  margin 1rem 0
  margin-top 2rem
  margin-bottom 1rem
</style>