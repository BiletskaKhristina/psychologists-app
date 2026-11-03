import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Modal } from '../../components/Modal/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, registerSchema } from '../../schemas/authSchemas';
import { Eye, EyeOff } from 'lucide-react';
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
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(userCredential.user, { displayName: data.name });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      closeModal();
    } catch (error) {
      alert('Неправильний email або пароль');
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

      {/* Модальне вікно */}
      <Modal 
        isOpen={authModal.isOpen} 
        onClose={closeModal} 
        title={isRegister ? 'Registration' : 'Log In'}
      >
        <p className="modal-subtitle">
          {isRegister
            ? 'Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.'
            : 'Welcome back! Please enter your credentials to access your account and continue your search for a psychologist.'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          {isRegister && (
            <div className="modal-field">
              <input 
                {...register('name')} 
                type="text" 
                placeholder="Name" 
                className="modal-input" 
              />
              {errors.name && <span className="error-msg">{errors.name.message}</span>}
            </div>
          )}

          <div className="modal-field">
            <input 
              {...register('email')} 
              type="email" 
              placeholder="Email" 
              className="modal-input" 
            />
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>

          <div className="modal-field password-field-wrapper">
            <input 
              {...register('password')} 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              className="modal-input password-input" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="eye-toggle-btn"
              aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
            >
              {showPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} />}
            </button>
            {errors.password && <span className="error-msg">{errors.password.message}</span>}
          </div>

          <button type="submit" className="modal-submit-btn">
            {isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>
      </Modal>
    </div>
  );
};