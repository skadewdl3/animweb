import { getAuth } from 'firebase/auth'
import {
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
} from 'firebase/auth'

export default () => {
  let user = undefined

  const app = useApp()
  const auth = getAuth(app)

  const signInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    user = await _signInWithEmailAndPassword(auth, email, password).catch(
      err => {
        throw err
      }
    )
    if (user) return user
    else return undefined
  }

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string,
    username: string
  ) => {
    user = await _createUserWithEmailAndPassword(auth, email, password).catch(
      err => {
        throw err
      }
    )
    if (user) return user
    else return undefined
  }

  const signInWithGoogle = async () => {
    let c = await signInWithPopup(auth, new GoogleAuthProvider())
    console.log(c)
  }

  const signOut = () => {}

  return {
    signInWithEmailAndPassword,
    signInWithGoogle,
    createUserWithEmailAndPassword,
    user,
    signOut,
  }
}
