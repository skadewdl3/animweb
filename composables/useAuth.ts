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

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    user = await _signInWithEmailAndPassword(auth, email, password).catch(
      err => {
        throw err
      }
    )
    if (user) {
    } else return undefined
  }

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    let temp = (user = await _createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).catch(err => {
      throw err
    }))
    if (temp) {
      user = temp
      return user
    } else return undefined
  }

  const createUserWithGoogle = async () => {
    let temp = await signInWithPopup(auth, new GoogleAuthProvider()).catch(
      err => {
        throw err
      }
    )
    if (temp) {
      user = temp
      return user
    } else return undefined
  }

  const loginWithGoogle = async () => {
    let temp = await signInWithPopup(auth, new GoogleAuthProvider()).catch(
      err => {
        throw err
      }
    )
    if (temp) {
      user = temp
      return user
    } else return undefined
  }

  const signOut = () => {}

  return {
    loginWithEmailAndPassword,
    loginWithGoogle,
    createUserWithEmailAndPassword,
    createUserWithGoogle,
    user,
    signOut,
  }
}
