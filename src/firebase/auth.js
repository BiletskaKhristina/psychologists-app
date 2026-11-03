import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { auth } from "./config";

// Реєстрація нового користувача
export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Додаємо ім'я користувача до профілю Firebase
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
};

// Логін існуючого користувача
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Вихід з системи
export const logoutUser = async () => {
  await signOut(auth);
};