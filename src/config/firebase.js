// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY0Dprof-qXefURPceL1_a84CauHUuNV4",
  authDomain: "imagestore-97975.firebaseapp.com",
  projectId: "imagestore-97975",
  storageBucket: "imagestore-97975.appspot.com",
  messagingSenderId: "700099316297",
  appId: "1:700099316297:web:e2cd0f0448f5e07d734d98",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase storage reference
const storage = getStorage(app);
export default storage;
