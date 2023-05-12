<script setup lang="ts">
import { editor } from '@/main'
import code from '@/reactives/code'
import error from '@/reactives/error'
import { onMounted } from 'vue'

onMounted(() => {
  editor.create()
})
</script>

<template>
  <div class="user-controls-wrapper" style="position: absolute;
            top: 2rem;
            right: 1rem;
            min-width: 40%;
            max-width: 40%;
            z-index: 2;">
    <div style="
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 1rem;
		">
      <p style="font-family: sans-serif; font-size: 3rem" class="code-title"
        :style="{ visibility: code.hidden ? 'hidden' : 'visible' }">
        Code
      </p>
      <div style="display: flex; align-items: center; justify-content: center">
        <button class="btn btn-play" @click="editor.run()">Play</button>
        <button class="btn btn-clear" @click="editor.clear()">Clear</button>
        <button v-if="!code.hidden" class="btn btn-hide-code" @click="code.hide()">
          Hide Code
        </button>
        <button v-if="code.hidden" class="btn btn-show-code" @click="code.show()">
          Show Code
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
    <div :class="{ hidden: code.hidden }" class="codemirror-editor-container"></div>
  </div>
</template>

<style></style>