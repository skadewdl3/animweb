<script setup lang="ts">
import { Slider } from '@/mixins/Slider';
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

<style></style>