import { getAuth } from 'firebase/auth'
import { signInWithEmailAndPassword as _signInWithEmailAndPassword } from 'firebase/auth'

export default () => {
  let user = undefined

  const app = useApp()
  const auth = getAuth(app)

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    let user = await _signInWithEmailAndPassword(auth, email, password).catch(
      err => {
        throw err
      }
    )
    if (user) return user
    else return undefined
  }

  const signInWithGoogle = () => {}

  const signOut = () => {}

  return { signInWithEmailAndPassword, signInWithGoogle, user, signOut }
}
