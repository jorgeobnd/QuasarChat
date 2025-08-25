<template>
  <q-page padding>
    <access-view v-if="!isAuthenticated" />
    <div v-else>
      <active-users-view />
      <ChatView />
    </div>
  </q-page>
</template>

<script setup>
import AccessView from 'components/accessView.vue'
import { getAuth } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase'
import ActiveUsersView from 'components/activeUsersView.vue'
import ChatView from 'components/chatView.vue'
import { provide, ref } from 'vue'

const auth = getAuth()
const { isAuthenticated } = useAuth(auth)
const userSelect = ref('')
provide('userSelect', userSelect)
</script>
