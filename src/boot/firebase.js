import { defineBoot } from '#q-app/wrappers'
import { getAuth } from 'firebase/auth'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAmUbI-doLY2DZJ5TRtcwnBYO9ozxUDGaw',
  authDomain: 'firechat-quasar-4fc78.firebaseapp.com',
  projectId: 'firechat-quasar-4fc78',
  storageBucket: 'firechat-quasar-4fc78.firebasestorage.app',
  messagingSenderId: '761825869847',
  appId: '1:761825869847:web:cb111c6b48b8add3711c52',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const time = serverTimestamp()

export { db, auth, time }

export default defineBoot(async (/* { app, router, ... } */) => {
  // something to do
})
