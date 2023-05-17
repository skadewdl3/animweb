<script setup lang="ts">
import Button from '@ui/Button.vue'
import Prompt from '@ui/Prompt.vue'
import Slider from '@ui/Slider.vue'
import SVGItem from '@ui/SVGItem.vue'

import { buttons } from '@reactives/buttons.ts'
import { prompts } from '@reactives/prompts.ts'
import { sliders } from '@reactives/sliders.ts'
import { svgData } from '@reactives/svg.ts'

const props = defineProps(['disabled'])
</script>

<template>
  <div v-if="!props.disabled" class="user-ui-component z-1 user-svgs">
    <SVGItem v-for="svgItem in svgData.svgs" :svgItem="svgItem" />
  </div>

  <div v-if="!props.disabled" class="user-ui-component user-sliders z-2">
    <Button v-for="button in buttons.buttons" :button="button" />
  </div>

  <div v-if="!props.disabled" class="user-ui-component user-buttons z-2">
    <Prompt v-for="prompt in prompts.prompts" :prompt="prompt" />
  </div>

  <div v-if="!props.disabled" class="user-ui-component user-prompts z-2">
    <Slider v-for="slider in sliders.sliders" :slider="slider" />
  </div>
</template>

<style lang="stylus">
.user-ui-component
  position absolute
  top 0
  left 0

.z-1
  z-index 1

.z-2
  z-index 2
</style>