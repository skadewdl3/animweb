<script setup lang="ts">


definePageMeta({
  title: 'AnimWeb - Dashboard',
  description: 'Your Animations',
  middleware: 'auth'
})

let auth = await useAuth()

watch(() => auth.isAuthenticated(), () => {
  if (!auth.isAuthenticated()) {
    navigateTo('/login')
  }
})


const logout = () => auth.logout()
</script>

<template>
<div>this is the dashboard</div>
<NuxtLink to="/animate">Animate</NuxtLink>
<button @click="logout">Logout</button>
</template>

<style lang="stylus">

</style>