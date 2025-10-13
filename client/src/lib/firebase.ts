import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMlPuH5M7F18rh2nUdgyGVL_XuJLJfQhk",
  authDomain: "sweetheart-c7379.firebaseapp.com",
  projectId: "sweetheart-c7379",
  storageBucket: "sweetheart-c7379.appspot.com", // ✅ fixed
  messagingSenderId: "1062216919998",
  appId: "1:1062216919998:web:9c08b2649a3f97cd6227ef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
