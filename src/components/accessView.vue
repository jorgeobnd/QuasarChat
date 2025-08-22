<template>
  <div class="q-px-xl">
    <h5>{{ access ? 'Login' : 'Register' }} Form</h5>
    <q-form class="q-gutter-md" @submit.prevent="processForm">
      <q-input label="Mail" name="mail" v-model="mail" />
      <q-input label="Password" name="password" v-model="password" />
      <q-btn label="Login/register" type="submit" color="primary" />
      <q-btn color="primary" outline v-if="!access" @click="access = true">
        Have an account?
      </q-btn>
      <q-btn color="negative" outline v-else @click="access = false"> Haven´t an account?</q-btn>
    </q-form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
export default {
  setup() {
    const mail = ref('jorge@gmail.com')
    const password = ref('123456')
    const access = ref(true)
    const auth = getAuth()

    const processForm = async () => {
      if (!mail.value || !password.value) {
        console.log('Fields empty')
      }
      try {
        if (!access.value) {
          const newUser = await createUserWithEmailAndPassword(auth, mail.value, password.value)
          console.log(newUser.user)
        } else {
          const useRegistered = await signInWithEmailAndPassword(auth, mail.value, password.value)
          console.log(useRegistered.user)
        }

        mail.value = ''
        password.value = ''
      } catch (e) {
        console.error(e)
      }
    }

    return {
      mail,
      password,
      access,
      processForm,
    }
  },
}
</script>
