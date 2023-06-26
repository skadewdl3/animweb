<script setup lang="ts">
import code from '@reactives/code.ts'
import error from '@reactives/error.ts'
import { editor } from '@reactives/editor.ts'
import { LoadingOutlined } from '@ant-design/icons-vue'

const props = defineProps(['disabled'])
const saving = ref(false)
const auth = await useAuth()

const save = () => {
  saving.value = !saving.value
}

</script>

<template>
  <div class="user-controls-wrapper">
    <div class="user-controls-buttons-container">
      <p class="code-title" :class="{ 'goright-code': code.hidden }">
        <span>Code</span>
        <span class="code-title-mode">{{ code.mode }}</span>
      </p>
      <div class="code-controls">
        <button class="code-button" :disabled="props.disabled" @click="editor.run()">
          Play
        </button>
        <button class="code-button" :disabled="props.disabled" @click="editor.clear()">
          Clear
        </button>
        <button class="code-button code-animated-button" @click="code.toggle">
          <span :class="{ godown: !code.hidden }">Show Code</span>
          <span :class="{ goup: code.hidden }">Hide Code</span>
        </button>
        <button
          class="code-button code-animated-button"
          @click="code.toggleMode"
          :disabled="props.disabled"
        >
          <span :disabled="props.disabled" :class="{ godown: code.mode == '2D' }"
            >Switch to 2D</span
          >
          <span :disabled="props.disabled" :class="{ goup: code.mode == '3D' }"
            >Switch to 3D</span
          >
        </button>
        <button v-if="auth.isAuthenticated()" @click="save" class="code-button">
          <span>Save</span>
          <LoadingOutlined v-if="saving" />
        </button>
      </div>
    </div>
    <div class="code-error" :class="{ hidden: error.hidden }">
      <div class="code-error-message">
        {{ error.type }}: {{ error.message }}
      </div>
      <div class="code-error-line">
        {{ !isNaN(error.lineNumber) ? 'at line' : '' }}
        {{ !isNaN(error.lineNumber) ? error.lineNumber : '' }}
      </div>
    </div>
    <div
      :class="{ 'goright-code': code.hidden }"
      class="codemirror-editor-container"
    ></div>
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

    &-mode
      font-size 1.5rem
      margin-left 0.5rem
      font-weight bold
      color rgba(0, 0, 0, 0.5)

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
      &:disabled
        transform translateY(0)

    &:disabled
      background-color #ccc
      border solid 0.1rem #ccc
      color #000

.code-animated-button
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


.cm-editor
  font-family serif
  font-size 2rem
  background #fff
  border-radius 1rem
  outline none
  border solid 0.1rem #ccc
// .cm-line
//   span
//     color #000!important
.cm-scroller
  border-radius 1rem
.cm-gutterElement
  background #fff
  padding 0 1rem!important;
.cm-foldGutter
  .cm-gutterElement
    display none
.cm-activeLineGutter
  background #fff!important
.btn
  cursor pointer
  padding 0.5rem 1rem
  font-size 2rem
  font-family sans-serif
  border 0
  background #6c5ce7
  color #fff
  border-radius 0.2rem
  margin-right 0.5rem

.hidden
  display none

.hidden-text
  visibility hidden

.btn-play
  display block

.btn-hidden
  display none

.code-error
  font-size 1.6rem
  color #ff0000
  padding 1rem 1rem
  background #fff
  border-top-right-radius 1rem
  border-top-left-radius 1rem
  border solid 0.2rem rgba(183, 21, 64, 0.5)

.code-error-message
  font-weight bold
  margin-bottom 0.5rem
</style>
