# Psychologists Services 🧠

Вебзастосунок для пошуку, підбору та запису на консультації до кваліфікованих психологів. Проєкт створений з акцентом на сучасний адаптивний дизайн, зручну навігацію та інтерактивний функціонал.

---

## 🚀 Основний функціонал

1. **Сторінка Home**
   - Головна сторінка з описом сервісу.
   - Слоган та швидкий перехід до каталогу психологів.

2. **Сторінка Psychologists**
   - Каталог психологів із пагінацією (по 3 картки).
   - Кнопка Load more для завантаження наступних карток.
   - Фільтрація та сортування за алфавітом (A–Z, Z–A), ціною та рейтингом.
   - Перегляд детальної інформації про психолога.
   - Перегляд відгуків клієнтів за допомогою кнопки Read more.

3. **Сторінка Favorites**
   - Перегляд обраних психологів.
   - Збереження улюблених фахівців користувача.

4. **Авторизація та автентифікація**
   - Реєстрація та вхід користувачів.
   - Інтеграція з Firebase Authentication.
   - Збереження сесії користувача.
   - Персоналізація інтерфейсу залежно від статусу авторизації.

5. **Модальні вікна та форми**
   - Форми реєстрації та входу.
   - Форма запису на консультацію (Make an appointment).
   - Валідація форм за допомогою React Hook Form та Yup.
   - Закриття модальних вікон кнопкою, кліком поза вікном або клавішею Esc.

6. **Збереження обраного**
   - Синхронізація обраних психологів через localStorage.
   - Обмеження доступу до функціоналу обраного для неавторизованих користувачів.

---

## 🛠 Технології

- **Frontend:** React, React Router, Vite, HTML5, CSS3, JavaScript (ES6+).
- **State Management:** React Hooks.
- **Forms:** React Hook Form, Yup.
- **Backend & Database:** Firebase Authentication, Firebase Realtime Database.
- **Icons:** Lucide React.
- **Design:** адаптивна верстка для пристроїв від 320px до 1440px.
- **Deployment:** Netlify / Vercel.

---

## 📦 Встановлення та запуск локально

### 1. Клонування репозиторію

```bash
git clone https://github.com/your-username/psychologists-services.git
```

### 2. Перехід до папки проєкту

```bash
cd psychologists-services
```

### 3. Встановлення залежностей

```bash
npm install
```

### 4. Налаштування Firebase

Створіть файл `.env` у кореневій папці проєкту та додайте налаштування Firebase:

```ini
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Запуск проєкту

```bash
npm run dev
```

Після запуску відкрийте адресу, яку Vite покаже в терміналі (зазвичай `http://localhost:5173`).

---

## 🔗 Посилання

- **GitHub Repository:** [Посилання на репозиторій](https://github.com/your-username/psychologists-services)
- **Live Demo:** [Посилання на розгорнутий застосунок](#)
- **Figma Design:** [https://www.figma.com/file/I5vjNb0NsJOpQRnRpMloSY/Psychologists.Services?type=design&node-id=0-1&mode=design&t=4zfT2zFANRbp1fCK-0]

---
