import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBho3fGD4tcyQyeoS_OfrLoeh51mX2Bvlw",
  authDomain: "psychologists-app-be94d.firebaseapp.com",
  databaseURL: "https://psychologists-app-be94d-default-rtdb.firebaseio.com",
  projectId: "psychologists-app-be94d",
  storageBucket: "psychologists-app-be94d.firebasestorage.app",
  messagingSenderId: "678999353819",
  appId: "1:678999353819:web:38631f7c7a4da28f4edffe"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // Тільки app, без другого аргументу!