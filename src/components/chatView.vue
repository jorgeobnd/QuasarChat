<template>
  <div ref="RefChat" v-if="userSelect !== ''" class="q-mt-xl">
    <div class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 600px">
        <q-chat-message
          v-for="chat in chats"
          :key="chat.id"
          :name="chat.user"
          :text="[chat.message]"
          :sent="chat.uid === user.uid"
        />
      </div>
    </div>
    <q-footer>
      <q-form @submit.prevent="sendMessage">
        <q-toolbar class="bg-grey-3 text-black row">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
          <q-input
            rounded
            outlined
            dense
            class="col-grow q-mr-sm"
            bg-color="white"
            v-model="message"
            placeholder="Type a message"
          />
          <q-btn round flat icon="send" type="submit" />
        </q-toolbar>
      </q-form>
    </q-footer>
  </div>
  <div v-else class="q-mt-xl">
    <h5 class="q-mt-xl">Select some contact for start the conversation</h5>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue'
import { useAuth } from '@vueuse/firebase'
import { db, time } from 'boot/firebase.js'
import { getAuth } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore'

const message = ref('')
const userSelect = inject('userSelect')
const auth = getAuth()
const { user } = useAuth(auth)
const chats = ref([])
const RefChat = ref(null)
let unsuscribe

const getMessage = (userSelectedUid) => {
  chats.value = []
  // build reference: chat/{currentUser}/{selectedUser}
  const messagesRef = collection(db, 'chat', user.value.uid, userSelectedUid)

  // add ordering
  const q = query(messagesRef, orderBy('date'))

  // subscribe to realtime updates
  unsuscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        chats.value.push({ ...change.doc.data(), id: change.doc.id })
      }

      if (RefChat.value !== null) {
        setTimeout(() => {
          window.scrollTo(0, RefChat.value.scrollHeight)
        }, 60)
      }
    })
  })
}

watch(
  () => userSelect.value,
  (newUid) => {
    if (unsuscribe) {
      unsuscribe()
      if (newUid) {
        getMessage(newUid)
      }
    } else {
      getMessage(newUid)
    }
  },
)

const sendMessage = async () => {
  /*if (message.value.trim()) {
    return
  }*/
  try {
    const objectMessage = {
      user: user.value.email,
      message: message.value,
      date: time,
      uid: user.value.uid,
    }

    // save message under sender → recipient
    await addDoc(collection(db, 'chat', user.value.uid, userSelect.value), objectMessage)

    // save message under recipient → sender
    await addDoc(collection(db, 'chat', userSelect.value, user.value.uid), objectMessage)
    message.value = ''
  } catch (error) {
    console.log(error)
  }
}
</script>
