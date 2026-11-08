import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase/config';
import { AppointmentModal } from '../../components/AppointmentModal/AppointmentModal';
import '../PsychologistsPage/PsychologistsPage.css';

export const FavoritesPage = () => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('Popular');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  const filterOptions = [
    'Show all',
    'A to Z',
    'Z to A',
    'Less than 10 $',
    'Greater than 10 $',
    'Popular',
    'Not popular'
  ];

  useEffect(() => {
    const fetchFavoritesData = async () => {
      try {
        const psychologistsRef = ref(db, 'psychologists');
        const snapshot = await get(psychologistsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const items = Array.isArray(data) 
            ? data.map((item, index) => ({
                id: item?.id || String(index),
                ...item
              }))
            : Object.keys(data).map((key) => ({
                id: key,
                ...data[key]
              }));
          setPsychologists(items);
        }

        const savedFavorites = JSON.parse(localStorage.getItem('psychologists_favorites')) || {};
        setFavorites(savedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavoritesData();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('psychologists_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleReadMore = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  // Жорстка фільтрація: залишаємо тільки ті картки, де favorites[item.id] === true
  let favoritePsychologists = psychologists.filter((item) => favorites[item.id] === true);

  if (selectedFilter === 'A to Z') {
    favoritePsychologists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedFilter === 'Z to A') {
    favoritePsychologists.sort((a, b) => b.name.localeCompare(a.name));
  } else if (selectedFilter === 'Less than 10 $') {
    favoritePsychologists = favoritePsychologists.filter(item => (item.price_per_hour || item.price) < 10);
  } else if (selectedFilter === 'Greater than 10 $') {
    favoritePsychologists = favoritePsychologists.filter(item => (item.price_per_hour || item.price) >= 10);
  } else if (selectedFilter === 'Popular') {
    favoritePsychologists.sort((a, b) => b.rating - a.rating);
  } else if (selectedFilter === 'Not popular') {
    favoritePsychologists.sort((a, b) => a.rating - b.rating);
  }

  const displayedFavorites = favoritePsychologists.slice(0, visibleCount);

  return (
    <div className="psychologists-page">
      <div className="psychologists-container">
        
        <header className="header">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-green">psychologists</span>
            <span className="logo-dot">.</span>
            <span className="logo-dark">services</span>
          </div>
          
          <nav className="nav">
            <a href="/" className="nav-link">Home</a>
            <a href="/psychologists" className="nav-link">Psychologists</a>
            <a href="/favorites" className="nav-link active">
              Favorites
              <span className="active-dot"></span>
            </a>
          </nav>

          <div className="auth-header-section">
            <div className="user-profile-badge">
              <div className="user-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBFBFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="user-fullname">Христина</span>
            </div>
            <button className="logout-action-btn" onClick={() => navigate('/')}>Log out</button>
          </div>
        </header>

        <div className="filter-wrapper">
          <label className="filter-label">Filters</label>
          <div 
            className="filter-dropdown-box" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="filter-selected-text">{selectedFilter}</span>
            <div className={`filter-arrow-icon ${isMenuOpen ? 'open' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#FBFBFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {isMenuOpen && (
            <div className="filter-menu">
              {filterOptions.map((option, index) => (
                <div 
                  key={`filter-${index}-${option}`}
                  className={`filter-menu-item ${selectedFilter === option ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(option);
                    setIsMenuOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {favoritePsychologists.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#191A15' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>No favorite psychologists yet</h2>
            <p style={{ color: '#8a8a89', marginBottom: '24px' }}>Go to the main catalog and click the heart icon on cards you like.</p>
            <button 
              className="appointment-submit-btn" 
              style={{ width: '200px', margin: '0 auto' }}
              onClick={() => navigate('/psychologists')}
            >
              Explore Psychologists
            </button>
          </div>
        ) : (
          <div className="psychologists-list">
            {displayedFavorites.map((item) => {
              const cardId = item.id;
              const isExpanded = expandedCards[cardId];

              return (
                <div key={cardId} className="psychologist-card">
                  
                  <div className="card-avatar-wrapper">
                    <div className="avatar-outer-frame">
                      <img src={item.avatar_url || item.avatar} alt={item.name} className="avatar-image" />
                      <span className="online-indicator"></span>
                    </div>
                  </div>

                  <div className="card-content-area">
                    <div className="card-top-row">
                      <div className="card-titles">
                        <p className="card-profession">Psychologist</p>
                        <h2 className="card-name">{item.name}</h2>
                      </div>

                      <div className="card-meta-actions">
                        <div className="card-rating-price">
                          <div className="rating-block">
                            <Star size={16} fill="#FFC531" color="#FFC531" />
                            <span>Rating: {item.rating}</span>
                          </div>
                          <div className="meta-divider"></div>
                          <div className="price-block">
                            Price / 1 hour: <span className="price-value">{item.price_per_hour || item.price}$</span>
                          </div>
                        </div>
                        <button 
                          className="favorite-btn active"
                          onClick={() => toggleFavorite(cardId)}
                          aria-label="Remove from favorites"
                          type="button"
                        >
                          <Heart size={20} color="#191A15" strokeWidth={2} fill="#54BE96" />
                        </button>
                      </div>
                    </div>

                    <div className="badges-grid">
                      {[
                        { keyName: 'Experience', val: item.experience },
                        { keyName: 'License', val: item.license },
                        { keyName: 'Specialization', val: item.specialization },
                        { keyName: 'Initial consultation', val: item.initial_consultation || item.initialConsultation }
                      ].map((badge) => (
                        <div key={`${cardId}-${badge.keyName}`} className="badge-item">
                          <span className="badge-key">{badge.keyName}:</span> <span className="badge-val">{badge.val}</span>
                        </div>
                      ))}
                    </div>

                    <p className="card-description">
                      {item.about}
                    </p>

                    {!isExpanded ? (
                      <button className="read-more-link" onClick={() => toggleReadMore(cardId)}>
                        Read more
                      </button>
                    ) : (
                      <div className="expanded-section">
                        <div className="reviews-container">
                          {item.reviews && item.reviews.map((rev, idx) => (
                            <div key={rev.id || `${cardId}-review-${idx}`} className="review-item">
                              <div className="review-author-row">
                                <div className="review-avatar-initial">
                                  {rev.reviewer ? rev.reviewer.charAt(0) : 'U'}
                                </div>
                                <div className="review-author-meta">
                                  <span className="review-author-name">{rev.reviewer}</span>
                                  <div className="review-rating-row">
                                    <Star size={14} fill="#FFC531" color="#FFC531" />
                                    <span>{rev.rating}.0</span>
                                  </div>
                                </div>
                              </div>
                              <p className="review-comment">{rev.comment}</p>
                            </div>
                          ))}
                        </div>

                        <button 
                          className="appointment-btn"
                          onClick={() => {
                            setSelectedPsychologist(item);
                            setIsAppointmentOpen(true);
                          }}
                        >
                          Make an appointment
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {visibleCount < favoritePsychologists.length && (
          <div className="load-more-wrapper" style={{ marginTop: '48px', marginBottom: '60px' }}>
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load more
            </button>
          </div>
        )}

      </div>

      <AppointmentModal 
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        psychologist={selectedPsychologist}
      />
    </div>
  );
};

export default FavoritesPage;