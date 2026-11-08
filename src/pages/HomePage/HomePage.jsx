import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, registerSchema } from '../../schemas/authSchemas';
import { Eye, EyeOff, X } from 'lucide-react';
import './HomePage.css';

export const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isRegister = authModal.mode === 'register';
  const schema = isRegister ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const openLogin = () => {
    reset();
    setShowPassword(false);
    setAuthModal({ isOpen: true, mode: 'login' });
  };

  const openRegister = () => {
    reset();
    setShowPassword(false);
    setAuthModal({ isOpen: true, mode: 'register' });
  };

  const closeModal = () => {
    reset();
    setShowPassword(false);
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        // Реєстрація нового користувача
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(userCredential.user, { displayName: data.name });
      } else {
        // Вхід існуючого користувача
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      closeModal();
    } catch (error) {
      // Виводимо конкретну помилку від Firebase у консоль, щоб бачити причину
      console.error("Auth error:", error.code, error.message);

      if (error.code === 'auth/email-already-in-use') {
        alert('Цей email вже зареєстрований!');
      } else if (error.code === 'auth/weak-password') {
        alert('Пароль занадто слабкий (мінімум 6 символів).');
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        alert('Неправильний email або пароль.');
      } else {
        alert(`Помилка: ${error.message}`);
      }
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        
        {/* Шапка */}
        <header className="header">
          <div className="logo">
            <span className="logo-green">psychologists</span>
            <span className="logo-dot">.</span>
            <span className="logo-dark">services</span>
          </div>
          
          <nav className="nav">
            <a href="/" className="nav-link active">Home</a>
            <a href="/psychologists" className="nav-link">Psychologists</a>
            {user && <a href="/favorites" className="nav-link">Favorites</a>}
          </nav>

          <div className="auth-section">
            {user ? (
              <div className="user-panel">
                <span className="user-name">{user.displayName || user.email}</span>
                <button className="logout-btn" onClick={handleLogout}>Log out</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="login-btn" onClick={openLogin}>Log In</button>
                <button className="register-btn" onClick={openRegister}>Registration</button>
              </div>
            )}
          </div>
        </header>

        {/* Hero секція */}
        <section className="hero-section">
          <div className="hero-text-content">
            <h1 className="hero-title">
              The road to the <em className="hero-title-accent">depths</em> of the human soul
            </h1>
            <p className="hero-description">
              We help you to reveal your potential, overcome challenges and find a guide in your own life with the help of our experienced psychologists.
            </p>
            <button className="get-started-btn" onClick={() => navigate('/psychologists')}>
              Get started
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="hero-image-wrapper">
            <div className="image-container">
              <div className="decor-badge purple-badge"><span>💬</span></div>
              <div className="decor-badge yellow-badge"><span>👥</span></div>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
                alt="Psychologist" 
                className="hero-image"
              />
              <div className="stats-card">
                <div className="stats-icon-box">✓</div>
                <div className="stats-info">
                  <span className="stats-label">Experienced psychologists</span>
                  <span className="stats-number">15,000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Вбудоване модальне вікно авторизації */}
      {authModal.isOpen && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="appointment-modal-container" style={{ position: 'relative', width: '500px' }}>
            <button type="button" className="modal-close-btn" onClick={closeModal}>
              <X size={20} strokeWidth={2.5} />
            </button>

            <h2 className="appointment-modal-title">{isRegister ? 'Registration' : 'Log In'}</h2>
            <p className="appointment-modal-subtitle">
              {isRegister
                ? 'Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.'
                : 'Welcome back! Please enter your credentials to access your account and continue your search for a psychologist.'}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
              {isRegister && (
                <div className="appointment-field">
                  <input 
                    {...register('name')} 
                    type="text" 
                    placeholder="Name" 
                    className="appointment-input" 
                  />
                  {errors.name && <span className="appointment-error">{errors.name.message}</span>}
                </div>
              )}

              <div className="appointment-field">
                <input 
                  {...register('email')} 
                  type="email" 
                  placeholder="Email" 
                  className="appointment-input" 
                />
                {errors.email && <span className="appointment-error">{errors.email.message}</span>}
              </div>

              <div className="appointment-field" style={{ position: 'relative' }}>
                <input 
                  {...register('password')} 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  className="appointment-input" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '16px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                >
                  {showPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} />}
                </button>
                {errors.password && <span className="appointment-error">{errors.password.message}</span>}
              </div>

              <button type="submit" className="appointment-submit-btn">
                {isRegister ? 'Sign Up' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};