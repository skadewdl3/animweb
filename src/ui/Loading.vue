<script setup lang="ts">
import anime from 'animejs';
import { onMounted, onUnmounted, ref } from 'vue'
import loader from '@/main'


const ellipsis = ref<number>(0)

const interval = setInterval(() => {
  ellipsis.value++
  if (ellipsis.value > 3) ellipsis.value = 0
}, 500)

onMounted(() => {
  import('@/load.ts').then((module) => {
    module.default()
    anime({
      targets: '.loading-container',
      opacity: 0,
      duration: 1000,
      easing: 'easeInOutQuad',
      complete: () => {
        loader.unmount()
      }
    })
  })
})

onUnmounted(() => {
  clearInterval(interval)
})

</script>

<template>
  <div class="loading-container z-100">
    <div class="loading-text">
      <div class="loading-title">
        <span>AnimWeb is Loading</span><span>{{ '.'.repeat(ellipsis) }}</span>
      </div>
      <div class="loading-description">
        <span>AnimWeb is a web-based animation tool for interactive mathematical animations.</span>
        <span>We are working on speeding up the loading process.</span>
      </div>
    </div>
  </div>
</template>

<style>
.loading-container {
  position: fixed;
  background-image: radial-gradient(circle, rgba(52,31,151,1) 44%, rgba(9,132,227,1) 86%);
  width: 100%;
  height: 100vh;
}

.loading-text {
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  text-align: center;
}

.loading-title {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.loading-description {
  font-size: 2rem;
}


.z-100 {
  z-index: 100;
}
</style>
