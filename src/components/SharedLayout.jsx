import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { logoutUser } from "../firebase/auth";
import { Modal } from "./Modal/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser, loginUser } from "../firebase/auth";

// Схеми валідации Yup
const schemaRegister = yup.object({
  name: yup.string().required("Ім'я обов'язкове"),
  email: yup.string().email("Невірний формат email").required("Email обов'язковий"),
  password: yup.string().min(6, "Мінімум 6 символів").required("Пароль обов'язковий"),
}).required();

const schemaLogin = yup.object({
  email: yup.string().email("Невірний формат email").required("Email обов'язковий"),
  password: yup.string().required("Пароль обов'язковий"),
}).required();

export const SharedLayout = () => {
  const [user, setUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'login' | 'register' | null
  const navigate = useNavigate();

  // Слухач зміни стану авторизації Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #ccc' }}>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/psychologists">Psychologists</NavLink>
          {user && <NavLink to="/favorites">Favorites</NavLink>}
        </nav>
        <div>
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span>{user.displayName || user.email}</span>
              <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Log Out</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setModalType('login')} style={{ padding: '8px 16px', cursor: 'pointer' }}>Log In</button>
              <button onClick={() => setModalType('register')} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#0cb863', color: '#fff', border: 'none', borderRadius: '8px' }}>Registration</button>
            </div>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Модальне вікно Логіну */}
      <Modal isOpen={modalType === 'login'} onClose={() => setModalType(null)} title="Log In">
        <LoginForm onSuccess={() => setModalType(null)} />
      </Modal>

      {/* Модальне вікно Реєстрації */}
      <Modal isOpen={modalType === 'register'} onClose={() => setModalType(null)} title="Registration">
        <RegisterForm onSuccess={() => setModalType(null)} />
      </Modal>
    </div>
  );
};

// Компонент форми Логіну
const LoginForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schemaLogin)
  });

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      onSuccess();
    } catch (error) {
      alert("Помилка входу: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input {...register("email")} placeholder="Email" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
      <p style={{ color: 'red', fontSize: '12px' }}>{errors.email?.message}</p>
      
      <input type="password" {...register("password")} placeholder="Password" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
      <p style={{ color: 'red', fontSize: '12px' }}>{errors.password?.message}</p>
      
      <button type="submit" style={{ padding: '12px', backgroundColor: '#0cb863', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Log In</button>
    </form>
  );
};

// Компонент форми Реєстрації
const RegisterForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schemaRegister)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password, data.name);
      onSuccess();
    } catch (error) {
      alert("Помилка реєстрації: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input {...register("name")} placeholder="Name" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
      <p style={{ color: 'red', fontSize: '12px' }}>{errors.name?.message}</p>

      <input {...register("email")} placeholder="Email" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
      <p style={{ color: 'red', fontSize: '12px' }}>{errors.email?.message}</p>
      
      <input type="password" {...register("password")} placeholder="Password" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
      <p style={{ color: 'red', fontSize: '12px' }}>{errors.password?.message}</p>
      
      <button type="submit" style={{ padding: '12px', backgroundColor: '#0cb863', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Sign Up</button>
    </form>
  );
};