// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf6dzUIHfGwZNyht-c_ay_OzuO4tIedBY",
  authDomain: "react-poke-app-142d5.firebaseapp.com",
  projectId: "react-poke-app-142d5",
  storageBucket: "react-poke-app-142d5.appspot.com",
  messagingSenderId: "347471323794",
  appId: "1:347471323794:web:7e9549a3ec423ca716bc4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;