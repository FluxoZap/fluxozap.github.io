import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAh0Qi4lm-ZXQLe4YAca8wYbp5kcU6lY3I",
  authDomain: "fluxozap-10ead.firebaseapp.com",
  projectId: "fluxozap-10ead",
  storageBucket: "fluxozap-10ead.firebasestorage.app",
  messagingSenderId: "743375450552",
  appId: "1:743375450552:web:48b85313fbc7fc30b29f4d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
