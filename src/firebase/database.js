import { getDatabase, ref, get } from 'firebase/database';
import { app } from './config'; // Імпортуємо тільки app із config

const db = getDatabase(app); // Ініціалізуємо без повторного передавання URL

export const fetchPsychologists = async () => {
  try {
    const dbRef = ref(db, 'psychologists');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, value]) => ({ id, ...value }));
    }
    return [];
  } catch (error) {
    console.error("Помилка завантаження психологів:", error);
    throw error;
  }
};