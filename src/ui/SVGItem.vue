<script setup lang="ts">
import { onMounted } from 'vue';


const props = defineProps({
  svgItem: {
    type: Object,
    required: true
  }
})

console.log

onMounted(() => {
  props.svgItem.updateElement()
  console.log(props.svgItem)
  console.log('hi mom')
})

</script>

<template>
  <div :style="props.svgItem.styles" :id="props.svgItem.id" :class="props.svgItem.id" v-html="props.svgItem.svg">
  </div>
</template>

<style></style>