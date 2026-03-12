import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
    apiKey: "AIzaSyCRwgMhGGoQRzbGbaTeFKc-mzIyiCFuS24",
    authDomain: "agoramobile-bed68.firebaseapp.com",
    projectId: "agoramobile-bed68",
    storageBucket: "agoramobile-bed68.firebasestorage.app",
    messagingSenderId: "644716418169",
    appId: "1:644716418169:web:336b80d27d84d6143db0a8",
    measurementId: "G-TY1EFFEQ3H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth };