<script setup lang="ts">
import { editor } from '@reactives/editor.ts'
import code from '@reactives/code.ts'
import error from '@reactives/error.ts'
import { onMounted } from 'vue'

onMounted(() => {
  editor.create()
})
</script>

<template>
  <div class="user-controls-wrapper">
    <div class="user-controls-buttons-container">
      <p class="code-title"
        :class="{ 'goright-code': code.hidden }">
        Code
      </p>
      <div class="code-controls">
        <button class="code-button" @click="editor.run()">Play</button>
        <button class="code-button" @click="editor.clear()">Clear</button>
          <button  class="code-button code-visibility-button" @click="code.toggle">
              <span :class="{godown: !code.hidden}">Show Code</span>
              <span :class="{goup: code.hidden}">Hide Code</span>
          </button>
      </div>
    </div>
    <div class="code-error" :class="{ hidden: error.hidden }">
      <div class="code-error-message">{{ error.type }}: {{ error.message }}</div>
      <div class="code-error-line">
        {{ !isNaN(error.lineNumber) ? 'at line' : '' }}
        {{ !isNaN(error.lineNumber) ? error.lineNumber : '' }}
      </div>
    </div>
    <div :class="{ 'goright-code': code.hidden }" class="codemirror-editor-container"></div>
  </div>
</template>

<style lang="stylus">
.user-controls
  &-wrapper
    position absolute
    top 2rem
    right 1rem
    width 40%
    z-index 2
  &-buttons-container
    display flex
    align-items center
    justify-content space-between
    padding-bottom 1rem
    position relative

.code
  &-title
    font-family sans-serif
    position absolute
    top 50%
    left 0
    transform translateY(-50%)
    font-size 2rem
    font-weight bold
    transition all .2s ease-in-out

  &-controls
    display flex
    align-items center
    justify-content flex-end
    width 100%

  &-button
    // a blue button that becomes white with blue border on hovering and goes slightly down on pressing
    background-color #007bff
    border solid 0.1rem #007bff
    border-radius 0.25rem
    color white
    cursor pointer
    font-family sans-serif
    font-size 1.5rem
    padding 0.5rem 1rem
    transition all 0.2s ease-in-out
    margin-right 1rem
    &:hover
      background-color white
      border solid 0.1rem #007bff
      color #007bff
    &:active
      transform translateY(0.1rem)

.code-visibility-button
  width 10rem
  height 3rem
  white-space nowrap
  overflow hidden
  position relative
  span
    position absolute
    transform translate(-50%, -50%)
    transition transform .2s ease-in-out

.goup
  transform translate(-50%, -900%)!important

.godown
  transform translate(-50%, 900%)!important

.goright-code
  opacity 0
  transform translateY(-10%)!important

.codemirror-editor-container
  position absolute
  width 100%
  transition all .2s ease-in-out
</style>