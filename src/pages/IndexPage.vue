<template>
  <q-page padding>
    <access-view v-if="!isAuthenticated" />
  </q-page>
</template>

<script setup>
import AccessView from 'components/accessView.vue'
import { getAuth } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase'

const auth = getAuth()
const { isAuthenticated } = useAuth(auth)
</script>
