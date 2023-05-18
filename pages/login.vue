<script setup lang="ts">
const auth = useAuth()

const loginWithGoogle = async () => {
  let s  = await auth.signInWithEmailAndPassword('sohamk10@gmail.com', 'bruh1234')
  console.log(s)
}
</script>

<template>
  <Head>
    <Title>Animweb - Login</Title>
  </Head>
<span>
  <button class="login" @click="loginWithGoogle">Login with google</button>
</span>
</template>

<style lang="stylus">
.login
  font-size 10rem
</style>