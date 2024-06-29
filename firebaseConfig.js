import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2U_TFug1y6i21kJGTJ-n3v3Hp_FmlCkE",
  authDomain: "todo-app-7955e.firebaseapp.com",
  projectId: "todo-app-7955e",
  storageBucket: "todo-app-7955e.appspot.com",
  messagingSenderId: "493953987469",
  appId: "1:493953987469:web:967c6d661bd4b57ca443c4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };