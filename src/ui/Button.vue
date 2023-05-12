<script setup lang="ts">
import { Button } from '@/mixins/Button';
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

<style></style>