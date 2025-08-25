<template>
  <q-page-sticky position="top" expand class="tabs-zindex">
    <q-tabs
      v-model="userSelect"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-primary text-white shadow-2 full-width"
    >
      <q-tab
        v-for="user in computedUserName"
        :key="user.uid"
        :name="user.uid"
        icon="account_circle"
        :label="user.mail"
        :class="user.state ? 'text-white' : 'text-grey'"
      />
    </q-tabs>
  </q-page-sticky>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, inject } from 'vue'
import { db } from 'boot/firebase.js'
import { collection, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase'
const auth = getAuth()
const { user } = useAuth(auth)
const userSelect = inject('userSelect')
const users = ref([])

onMounted(() => {
  // get reference to "users" collection
  const usersCollection = collection(db, 'users')

  // listen in real-time
  const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        console.log('New user:', change.doc.data())
        users.value = [...users.value, change.doc.data()]
        users.value = users.value.sort((a, b) => b.state - a.state)
      }
      if (change.type === 'modified') {
        console.log('Modified user:', change.doc.data())
        users.value = users.value.map((user) =>
          user.uid === change.doc.data().uid ? { ...user, state: change.doc.data().state } : user,
        )
      }
      if (change.type === 'removed') {
        console.log('Removed user:', change.doc.data())
      }
    })
  })
  // clean up listener when component unmounts
  onUnmounted(() => unsubscribe())
})

const computedUserName = computed(() => {
  return users.value.filter((item) => item.uid !== user.value.uid)
})
</script>

<style scoped>
.tabs-zindex {
  z-index: 2000;
}
</style>
