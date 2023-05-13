<script setup lang="ts">
import { Prompt } from '@/mixins/Prompt';
import { onMounted } from 'vue';


const props = defineProps({
  prompt: {
    type: Object,
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
    <div class="user-prompt-title">{{ prompt.title }}</div>
    <div class="user-prompt-description">{{ prompt.description }}</div>
    <input type="text" :placeholder="prompt.placeholder || ''" :defaultValue="prompt.value || ''">
    <button class="user-button user-prompt-submit-btn">Submit</button>
  </div>
</template>

<style></style>