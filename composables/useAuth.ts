import { getAuth } from 'firebase/auth'
import {
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signOut as _signOut,
} from 'firebase/auth'

let user: any = undefined

export default () => {
  const app = useApp()
  const auth = getAuth(app)

  const isAuthenticated = () => user !== undefined

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    let { user: temp } = await _signInWithEmailAndPassword(
      auth,
      email,
      password
    ).catch(err => {
      throw err
    })
    if (temp) {
      user = temp
      return user
    } else return undefined
  }

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    let { user: temp } = (user = await _createUserWithEmailAndPassword(
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
    let { user: temp } = await signInWithPopup(
      auth,
      new GoogleAuthProvider()
    ).catch(err => {
      throw err
    })
    if (temp) {
      user = temp
      return user
    } else return undefined
  }

  const loginWithGoogle = async () => {
    let { user: temp } = await signInWithPopup(
      auth,
      new GoogleAuthProvider()
    ).catch(err => {
      throw err
    })
    if (temp) {
      user = temp
      return user
    } else return undefined
  }

  const logout = async () => {
    let temp = await _signOut(auth).catch(err => {
      throw err
    })

    user = temp
    return user
  }

  return {
    loginWithEmailAndPassword,
    loginWithGoogle,
    createUserWithEmailAndPassword,
    createUserWithGoogle,
    user,
    logout,
    isAuthenticated,
  }
}
