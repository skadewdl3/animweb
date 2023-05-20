import useServerApp from '../firebase/useServerApp'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async event => {
  let app = useServerApp()
  let body = await readBody(event)
  // create firestore entry
  return 'hi'
})
