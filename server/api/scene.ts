export default defineEventHandler(async event => {
  const sceneSetup = await import('./../../core/main')
  console.log(sceneSetup)
  return sceneSetup.default
})
