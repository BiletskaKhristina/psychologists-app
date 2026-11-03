import { useEffect, useState } from 'react';
import { fetchPsychologists } from '../firebase/database';
import { PsychologistCard } from '../components/PsychologistCard';
import { auth } from '../firebase/config'; // Перевір, чи шлях до твого config.js правильний

export const PsychologistsPage = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [sortBy, setSortBy] = useState('default'); // Стан для сортування
  const [visibleCount, setVisibleCount] = useState(3); // Пагінація: початково 3 картки
  const [favorites, setFavorites] = useState(() => 
    JSON.parse(localStorage.getItem('favorites')) || []
  );

  useEffect(() => {
    fetchPsychologists().then(setPsychologists).catch(console.error);
  }, []);

  const toggleFavorite = (id) => {
    // Перевірка авторизації (згідно з пунктом 6 ТЗ)
    if (!auth.currentUser) {
      alert('Будь ласка, увійдіть у систему, щоб додавати психологів до обраних.');
      return;
    }

    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // 1. Фільтрація (усі / обрані)
  const filteredData = psychologists.filter(item => {
    if (filter === 'favorites') return favorites.includes(item.id);
    return true;
  });

  // 2. Сортування
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'az') return a.name.localeCompare(b.name);
    if (sortBy === 'za') return b.name.localeCompare(a.name);
    if (sortBy === 'price-low') return a.price_per_hour - b.price_per_hour;
    if (sortBy === 'price-high') return b.price_per_hour - a.price_per_hour;
    if (sortBy === 'rating-high') return b.rating - a.rating;
    if (sortBy === 'rating-low') return a.rating - b.rating;
    return 0;
  });

  // 3. Зріз для пагінації (показуємо від 0 до visibleCount)
  const visiblePsychologists = sortedData.slice(0, visibleCount);

  // Функція для завантаження наступної порції карток
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Психологи</h1>

      {/* Панель фільтрів та сортування */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        {/* Фільтр Усі / Обрані */}
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="all">Усі</option>
          <option value="favorites">Обрані</option>
        </select>

        {/* Сортування згідно з ТЗ */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px' }}>
          <option value="default">Сортування за замовчуванням</option>
          <option value="az">А до Z</option>
          <option value="za">Z до А</option>
          <option value="price-low">Ціна: від найнижчої</option>
          <option value="price-high">Ціна: від найвищої</option>
          <option value="rating-high">Популярність (рейтинг): високий</option>
          <option value="rating-low">Популярність (рейтинг): низький</option>
        </select>
      </div>
      
      {/* Список карток */}
      <div className="cards-grid">
        {visiblePsychologists.map(psychologist => (
          <PsychologistCard 
            key={psychologist.id} 
            data={psychologist} 
            isFavorite={favorites.includes(psychologist.id)}
            onToggleFavorite={() => toggleFavorite(psychologist.id)}
          />
        ))}
      </div>

      {/* Кнопка "Load more" відображається лише тоді, коли є ще приховані картки */}
      {visibleCount < sortedData.length && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={handleLoadMore} 
            style={{ padding: '12px 24px', cursor: 'pointer', fontSize: '16px', borderRadius: '8px', background: '#095751', color: '#fff', border: 'none' }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};