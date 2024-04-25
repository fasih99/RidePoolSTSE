import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBW7ZWNGb_JfcyPrcwZ0DFUTcmnoW3QYu0",
  authDomain: "ride-away-app.firebaseapp.com",
  projectId: "ride-away-app",
  storageBucket: "ride-away-app.appspot.com",
  messagingSenderId: "139720500615",
  appId: "1:139720500615:web:8cdbc4306834b3e762df22",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth, db, storage };
