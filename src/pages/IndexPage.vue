<template>
  <q-page padding>
    <access-view v-if="!isAuthenticated" />
    <div v-else>
      <active-users-view/>
    </div>
  </q-page>
</template>

<script setup>
import AccessView from 'components/accessView.vue'
import { getAuth } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase'
import ActiveUsersView from 'components/activeUsersView.vue'

const auth = getAuth()
const { isAuthenticated } = useAuth(auth)
</script>
