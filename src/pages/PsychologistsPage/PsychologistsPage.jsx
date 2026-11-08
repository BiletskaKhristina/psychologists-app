import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase/config';
import { AppointmentModal } from '../../components/AppointmentModal/AppointmentModal';
import './PsychologistsPage.css';

export const PsychologistsPage = () => {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Show all');
  const [expandedCards, setExpandedCards] = useState({});
  const [favorites, setFavorites] = useState({});
  
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
    const fetchPsychologists = async () => {
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
        } else {
          console.log("No data available");
        }

        const savedFavorites = JSON.parse(localStorage.getItem('psychologists_favorites')) || {};
        setFavorites(savedFavorites);
      } catch (error) {
        console.error('Error fetching psychologists:', error);
      }
    };

    fetchPsychologists();
  }, []);

  const toggleReadMore = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('psychologists_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  let filteredPsychologists = [...psychologists];
  if (selectedFilter === 'A to Z') {
    filteredPsychologists.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedFilter === 'Z to A') {
    filteredPsychologists.sort((a, b) => b.name.localeCompare(a.name));
  } else if (selectedFilter === 'Less than 10 $') {
    filteredPsychologists = filteredPsychologists.filter(item => (item.price_per_hour || item.price) < 10);
  } else if (selectedFilter === 'Greater than 10 $') {
    filteredPsychologists = filteredPsychologists.filter(item => (item.price_per_hour || item.price) >= 10);
  } else if (selectedFilter === 'Popular') {
    filteredPsychologists.sort((a, b) => b.rating - a.rating);
  } else if (selectedFilter === 'Not popular') {
    filteredPsychologists.sort((a, b) => a.rating - b.rating);
  }

  const displayedPsychologists = filteredPsychologists.slice(0, visibleCount);

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
            <a href="/psychologists" className="nav-link active">
              Psychologists
              <span className="active-dot"></span>
            </a>
            <a href="/favorites" className="nav-link">Favorites</a>
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

        <div className="psychologists-list">
          {displayedPsychologists.map((item) => {
            const cardId = item.id;
            const isExpanded = expandedCards[cardId];
            const isFav = Boolean(favorites[cardId]);

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
                        className={`favorite-btn ${isFav ? 'active' : ''}`}
                        onClick={() => toggleFavorite(cardId)}
                        type="button"
                      >
                        <Heart size={20} color="#191A15" strokeWidth={2} fill={isFav ? '#54BE96' : 'none'} />
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

        {visibleCount < filteredPsychologists.length && (
          <div className="load-more-wrapper">
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

export default PsychologistsPage;