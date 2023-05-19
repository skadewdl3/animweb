<script setup lang="ts">
const auth = useAuth()

const mode = ref('login')
const functions = useServerFunctions()

const createUserWithGoogle = async () => {
  let user  = await auth.createUserWithGoogle()
  if (user) {
    functions.createUser('skadewdl3', 'sohamk10@gmail.com')
  }
}
</script>

<template>
  <Head>
    <Title>Animweb - Login</Title>
  </Head>
<span>
  <div class="register-ui">
    <input type="text" placeholder="username">
    <input type="text" placeholder="email">
    <input type="password" placeholder="password">
    <button class="register-btn register-email">Register with email</button>
    <button class="register-btn register-google" @click="createUserWithGoogle">Register with google</button>
  </div>
  <div class="login-ui">
    <input type="text" placeholder="username or email">
    <button class="login-btn login-email">Login with email</button>
    <button class="login-btn login-google">Login with google</button>
  </div>
  <button class="login">Login with google</button>
</span>
</template>

<style lang="stylus">
.login
  font-size 10rem
</style>