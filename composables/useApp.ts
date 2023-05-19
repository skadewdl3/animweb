import { initializeApp } from 'firebase/app'
export default () => {
  const runtimeConfig = useRuntimeConfig()
  const firebaseConfig = runtimeConfig.public.firebaseCredentials
  const app = initializeApp(firebaseConfig, 'client')
  return app
}
