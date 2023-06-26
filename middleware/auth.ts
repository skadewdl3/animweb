export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return
  const auth = await useAuth()
  if (to.path == '/login') {
    if (auth.isAuthenticated()) {
      return navigateTo('/dashboard')
    }
  } else if (to.path == '/dashboard') {
    if (!auth.isAuthenticated()) {
      return navigateTo('/login')
    }
  }
})
