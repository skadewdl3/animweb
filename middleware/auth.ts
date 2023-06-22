export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return
  console.log(useAuth().isAuthenticated())
  if (useAuth().isAuthenticated()) {
    return navigateTo('/dashboard')
  }
})
