import useServerApp from '../firebase/useServerApp'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async event => {
  let app = useServerApp()
  console.log(app)
  return {
    hi: 'mom',
  }
})
