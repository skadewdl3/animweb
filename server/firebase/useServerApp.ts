import { initializeApp, cert } from 'firebase-admin/app'

let app: any = undefined

export default () => {
  if (!app) {
    const runtimeConfig = useRuntimeConfig()
    const firebaseConfig = {
      ...runtimeConfig.firebaseAdminCredentials,
    }
    app = initializeApp({ credential: cert(firebaseConfig) }, 'server')
  }
  return app
}
