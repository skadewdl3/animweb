<script setup lang="ts">
import { onMounted } from 'vue';


const props = defineProps({
  svgItem: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  props.svgItem.updateElement()
})

</script>

<template>
  <div :style="props.svgItem.styles" :id="props.svgItem.id" :class="props.svgItem.id" v-html="props.svgItem.svg">
  </div>
</template>

<style></style>