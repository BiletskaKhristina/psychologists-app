import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, X, Eye, EyeOff } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { db, auth } from '../../firebase/config';
import { AppointmentModal } from '../../components/AppointmentModal/AppointmentModal';
import './PsychologistsPage.css';

export const PsychologistsPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [psychologists, setPsychologists] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Show all');
  const [expandedCards, setExpandedCards] = useState({});
  const [favorites, setFavorites] = useState({});
  
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  // Стани для вбудованої модалки авторизації та її полів
  const [authModal, setAuthModal] = useState({ isOpen: false, isRegister: false });
  const [showPassword, setShowPassword] = useState(false);
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalName, setModalName] = useState('');
  const [authError, setAuthError] = useState('');

  const filterOptions = [
    'Show all',
    'A to Z',
    'Z to A',
    'Less than 10 $',
    'Greater than 10 $',
    'Popular',
    'Not popular'
  ];

  // Слідкуємо за станом авторизації у Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
    if (!currentUser) {
      setAuthModal({ isOpen: true, isRegister: false });
      return;
    }

    setFavorites((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('psychologists_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Обробник сабміту форми входу / реєстрації у Firebase
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      if (authModal.isRegister) {
        // Реєстрація нового користувача
        const userCredential = await createUserWithEmailAndPassword(auth, modalEmail, modalPassword);
        if (modalName) {
          await updateProfile(userCredential.user, { displayName: modalName });
        }
      } else {
        // Логін існуючого користувача
        await signInWithEmailAndPassword(auth, modalEmail, modalPassword);
      }

      // Очищення полів та закриття модалки при успіху
      setAuthModal({ isOpen: false, isRegister: false });
      setModalEmail('');
      setModalPassword('');
      setModalName('');
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error.message);
    }
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
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Користувач';

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
            {currentUser ? (
              <>
                <div className="user-profile-badge">
                  <div className="user-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBFBFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <span className="user-fullname">{displayName}</span>
                </div>
                <button className="logout-action-btn" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <button 
                className="logout-action-btn" 
                onClick={() => setAuthModal({ isOpen: true, isRegister: false })}
              >
                Log in
              </button>
            )}
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

      {/* Робоче модальне вікно авторизації з Firebase */}
      {authModal.isOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setAuthModal({ ...authModal, isOpen: false }); }}>
          <div className="appointment-modal-container" style={{ position: 'relative', width: '500px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setAuthModal({ ...authModal, isOpen: false })}>
              <X size={20} strokeWidth={2.5} />
            </button>

            <h2 className="appointment-modal-title">{authModal.isRegister ? 'Registration' : 'Log In'}</h2>
            <p className="appointment-modal-subtitle">
              {authModal.isRegister
                ? 'Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.'
                : 'Welcome back! Please enter your credentials to access your account and continue your search for a psychologist.'}
            </p>

            {authError && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{authError}</div>}

            <form onSubmit={handleAuthSubmit} className="appointment-form">
              {authModal.isRegister && (
                <div className="appointment-field">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    className="appointment-input" 
                    required={authModal.isRegister}
                  />
                </div>
              )}

              <div className="appointment-field">
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  className="appointment-input" 
                  required
                />
              </div>

              <div className="appointment-field" style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  className="appointment-input" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '16px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                >
                  {showPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} />}
                </button>
              </div>

              <button type="submit" className="appointment-submit-btn">
                {authModal.isRegister ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
              {authModal.isRegister ? (
                <span>Already have an account? <button type="button" onClick={() => setAuthModal({ ...authModal, isRegister: false })} style={{ background: 'none', border: 'none', color: '#54BE96', cursor: 'pointer', fontWeight: 'bold' }}>Log in</button></span>
              ) : (
                <span>Don't have an account? <button type="button" onClick={() => setAuthModal({ ...authModal, isRegister: true })} style={{ background: 'none', border: 'none', color: '#54BE96', cursor: 'pointer', fontWeight: 'bold' }}>Register</button></span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologistsPage;