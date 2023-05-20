<script setup lang="ts">
import { v4 as uuid } from 'uuid';

const email = ref('')
const password = ref('')
const username = ref('')

const auth = useAuth()

const mode = ref('login')
const createOrLoginMode = ref('email')
const userCreatedOrLoggedIn = ref(false)
const functions = useServerFunctions()

const registerWithGoogle = async () => {
  createOrLoginMode.value = 'google'
  let user  = await auth.createUserWithGoogle()
  console.log(user)
  if (user) {
    let result = await functions.createUser(username.value, user)
    console.log(result)
  }
}

const registerWithEmail = async () => {
  createOrLoginMode.value = 'email'
  let user = await auth.createUserWithEmailAndPassword('sohamk10@gmail.com', 'heheboi123')
  if (user) {
    functions.createUser(username.value, user)
  }
}

const loginWithEmail = async () => {
  createOrLoginMode.value = 'email'
  let user = await auth.loginWithEmailAndPassword(email.value, password.value)
  if (user) {

  }
}

const loginWithGoogle = async () => {
  createOrLoginMode.value = 'google'
  let user = await auth.loginWithGoogle()
  if (user) {
    console.log(user)
  }
}

const logout = async () => {
  await auth.logout() 
  // do post logout stuff
}
</script>

<template>
  <Head>
    <Title>Animweb - Login</Title>
  </Head>
<span>
  <div class="auth-ui">

    <div class="register-ui" :class="{'go-left': mode == 'login'}">
      <input v-model="username" type="text" placeholder="username">
      <input v-model="email" type="text" placeholder="email">
      <input v-model="password" type="password" placeholder="password">
      <button class="register-btn register-email" @click="registerWithEmail">Register</button>
      <span>OR</span>
      <button class="register-btn register-google" @click="registerWithGoogle">Register with google</button>
    </div>
    <div class="login-ui" :class="{'go-right': mode == 'register'}">
      <input type="text" placeholder="username or email">
      <input v-model="password" type="password" placeholder="password">
      <button class="login-btn login-email" @click="loginWithEmail">Login</button>
      <span>OR</span>
      <button class="login-btn login-google" @click="loginWithGoogle">Login with google</button>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </div>
</span>
</template>

<style lang="stylus">
*
  margin 0
  padding 0

.login
  font-size 10rem

.auth-ui
  background red
</style>