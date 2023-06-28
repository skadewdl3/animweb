import { getAuth } from 'firebase/auth'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  signOut as _signOut,
} from 'firebase/auth'

const user: any = ref(null)

export default async () => {
  const app = useApp()
  const auth = getAuth(app)
  if (!auth.currentUser) {
    await setPersistence(auth, browserSessionPersistence)
  } else {
    user.value = auth.currentUser
  }

  const isAuthenticated = () => Boolean(user.value || auth.currentUser)

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    let { user: temp } = await _signInWithEmailAndPassword(
      auth,
      email,
      password
    ).catch(err => {
      throw err
    })
    if (temp) {
      user.value = temp
      return user
    } else return undefined
  }

  const createUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    let { user: temp } = await _createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).catch(err => {
      throw err
    })
    if (temp) {
      user.value = temp
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
      user.value = temp
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
      user.value = temp
      return user
    } else return undefined
  }

  const logout = async () => {
    let temp = await _signOut(auth).catch(err => {
      throw err
    })

    user.value = temp
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
