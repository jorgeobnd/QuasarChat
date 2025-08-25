<template>
  <div class="q-px-xl">
    <h5>{{ access ? 'Login' : 'Register' }} Form</h5>

    <q-form class="q-gutter-md" @submit.prevent="processForm">
      <q-input label="Mail" name="mail" v-model="mail" />
      <q-input label="Password" name="password" v-model="password" />
      <q-btn label="" type="submit" color="primary">
        {{ access ? 'Login' : 'Register' }}
      </q-btn>
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
import { useAuth } from '@vueuse/firebase'
import { db } from 'boot/firebase.js'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
export default {
  setup() {
    const mail = ref('jorge@gmail.com')
    const password = ref('123456')
    const access = ref(true)
    const auth = getAuth()
    const { isAuthenticated, user } = useAuth(auth)

    const processForm = async () => {
      if (!mail.value || !password.value) {
        console.log('Fields empty')
      }
      try {
        if (!access.value) {
          /*
           * Creating new Users function
           * db: variable instance in firebase.js file, created with firebase Boot documentation
           * createUserWith...: this is a native function for firebase, u can check the documentation about it
           *
           * comment:
           * this function return a new User & add this user to a collection in firebase, that's important for manage (in the future) how user 're active for 'chatting'
           * */

          const newUser = await createUserWithEmailAndPassword(auth, mail.value, password.value)

          await setDoc(doc(db, 'users', newUser.user.uid), {
            uid: newUser.user.uid,
            mail: newUser.user.email,
            state: true,
          })

          console.log(newUser.user)
        } else {
          /*
           * Login user function
           * */
          const useRegistered = await signInWithEmailAndPassword(auth, mail.value, password.value)

          await updateDoc(doc(db, 'users', useRegistered.user.uid), {
            state: true,
          })
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
      isAuthenticated,
      user,
    }
  },
}
</script>
