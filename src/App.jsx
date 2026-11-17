import './styles/media.css';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import PsychologistsPage from './pages/PsychologistsPage/PsychologistsPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { PrivateRoute } from './components/PrivateRoute'; // <-- імпортуємо твій новий компонент

export function App() {
  return (
    <Routes>
      {/* Публічні сторінки (доступні всім) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/psychologists" element={<PsychologistsPage />} />

      {/* Приватна сторінка (тільки для залогінених через PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>
    </Routes>
  );
}

export default App;