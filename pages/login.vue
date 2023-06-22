<script setup lang="ts">

import { GoogleOutlined } from '@ant-design/icons-vue'

definePageMeta({
  title: 'AnimWeb - Login',
  description: 'Login to Animweb',
  middleware: 'auth'
})


const email = ref('')
const password = ref('')
const username = ref('')

const auth = useAuth()

const mode = ref('login')
const createOrLoginMode = ref('email')
const functions = useServerFunctions()

const goToDashboard = () => {
  if (auth.isAuthenticated()) navigateTo('/dashboard')
}

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
  await auth.loginWithGoogle()
  if (auth.isAuthenticated()) {
    navigateTo('/dashboard')
  }
}

const logout = async () => {
  await auth.logout() 
  // do post logout stuff
}

</script>

<template>
<span>
  <div class="auth-ui-wrapper">
    <div class="auth-ui">
      <div class="register-ui" :class="{'go-left': mode == 'login'}">
        <div class="login-ui-title"><span>Register</span></div>
        <input class="auth-ui-input" v-model="username" type="text" placeholder="username">
        <input class="auth-ui-input" v-model="email" type="text" placeholder="email">
        <input class="auth-ui-input" v-model="password" type="password" placeholder="password">
        <button class="auth-ui-btn register-btn register-email" @click="registerWithEmail">Register</button>
        <span>OR</span>
        <button class="auth-ui-btn auth-ui-btn-google register-btn register-google" @click="registerWithGoogle">Register with google</button>
        <span @click="mode = 'login'">Already have an account ? Login</span>
      </div>
      <div class="login-ui" :class="{'go-right': mode == 'register'}">
        <div class="login-ui-title"><span>Login</span></div>
        <input class="auth-ui-input" type="text" placeholder="username or email">
        <input class="auth-ui-input" v-model="password" type="password" placeholder="password">
        <button class="auth-ui-btn login-btn login-email" @click="loginWithEmail">Login</button>
        <span>OR</span>
        <button class="auth-ui-btn auth-ui-btn-google login-btn login-google" @click="loginWithGoogle">
        <span class="auth-ui-btn-icon">
          <GoogleOutlined />
        </span>
          <span>Login with google</span></button>
        <span @click="mode = 'register'">Don't have an account ? Register</span>
      </div>
      <!-- <button class="logout-btn" @click="logout">Logout</button> -->
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
  position relative
  height 40rem
  overflow hidden
  &-wrapper
    width 40rem
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)

  &-input
    background #fff
    border solid 0.1rem #ccc
    display block
    border-radius 0.5rem
    font-size 1.5rem
    padding 0.5rem 1rem
    width 100%
    margin-bottom 0.5rem
    transition all .2s ease-in-out

    &:hover
    &:active
    &:focus
      border solid 0.1rem primary_color

  &-btn
    padding 0.5rem 1rem
    display flex
    align-items center
    justify-content space-between
    font-size 1.6rem
    border-radius 0.5rem
    background primary_color
    border solid 0.1rem primary_color
    color #fff
    cursor pointer
    transition all .2s ease-in-out
    white-space nowrap
    &:hover
      color primary_color
      background #fff
    &:active
      transition transform .1s ease-in-out
      transform translateY(0.2rem)
    &-icon
      margin-right 0.5rem
      

.register-ui
.login-ui
  position absolute
  top 0
  left 0
  width 100%
  transition all .2s ease-in-out
  display flex
  align-items center
  justify-content center
  flex-direction column  

  &-title
    text-align left
    width 100%
    font-size 4rem
    margin-bottom 1rem
  

.go-right
  transform translateX(-200%)

.go-left 
  transform translateX(200%)
</style>