import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

export const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // onAuthStateChanged слухає зміни стану авторизації від Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(Boolean(user));
    });

    return () => unsubscribe();
  }, []);

  // Поки Firebase ще перевіряє стан (перша до доля секунди), можна нічого не показувати або показати лоадер
  if (isAuthenticated === null) {
    return null; // або <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};