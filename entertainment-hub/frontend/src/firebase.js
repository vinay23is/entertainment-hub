import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDJD20P3_619_DADSUhWNVeWXnEUtoBOpU",
  authDomain: "entertainhub-c2208.firebaseapp.com",
  projectId: "entertainhub-c2208",
  storageBucket: "entertainhub-c2208.firebasestorage.app",
  messagingSenderId: "695157297323",
  appId: "1:695157297323:web:851d915daf9dbd964427ee"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)