<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ isAuthenticated ? user.email : 'Chat App' }} </q-toolbar-title>

        <div>
          <q-btn color="negative" v-if="isAuthenticated" @click="exitFunction"> Exit </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuth } from '@vueuse/firebase'
import { getAuth } from 'firebase/auth'
import { db } from 'boot/firebase.js'
import { doc, updateDoc } from 'firebase/firestore'
const auth = getAuth()
const { isAuthenticated, user } = useAuth(auth)

const exitFunction = async () => {
  try {
    await updateDoc(doc(db, 'users', user.value.uid), {
      state: false,
    })
    await auth.signOut()
  } catch (error) {
    console.error(error)
  }
}
</script>
