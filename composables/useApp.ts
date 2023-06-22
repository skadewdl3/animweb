import { initializeApp } from 'firebase/app'
let app: any = undefined
export default () => {
  if (!app) {
    const runtimeConfig = useRuntimeConfig()
    const firebaseConfig = runtimeConfig.public.firebaseCredentials
    app = initializeApp(firebaseConfig, 'client')
  }
  return app
}
