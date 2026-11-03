import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './AppointmentModal.css'; // Стилі створимо нижче

// Схема валідації за допомогою Yup
const appointmentSchema = yup.object().shape({
  name: yup.string().trim().required("Ім'я є обов'язковим"),
  phone: yup
    .string()
    .trim()
    .matches(/^\+?[0-9]{10,14}$/, 'Введіть коректний номер телефону (наприклад, +380123456789)')
    .required("Телефон є обов'язковим"),
  time: yup.string().required('Оберіть час сеансу'),
  email: yup.string().trim().email('Некоректний email').required("Email є обов'язковим"),
  comment: yup.string().trim().required("Коментар є обов'язковим"),
});

export const AppointmentModal = ({ psychologist, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      time: '09:00',
    },
  });

  // Закриття по клавіші Esc (згідно з ТЗ)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Обробка відправки форми
  const onSubmit = (data) => {
    console.log('Заявка на зустріч відправлена:', {
      psychologist: psychologist.name,
      ...data,
    });
    alert(`Дякуємо! Ви успішно записалися на прийом до ${psychologist.name}.`);
    reset();
    onClose();
  };

  // Закриття по кліку на backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} aria-label="Закрити">
          ✕
        </button>

        <h2>Make an appointment with a psychologist</h2>
        <p className="modal-subtitle">
          You are on the verge of changing your life for the better. Fill out the form below to book a personal meeting with <strong>{psychologist.name}</strong>.
        </p>

        <div className="doctor-info">
          <img src={psychologist.avatar_url} alt={psychologist.name} className="doctor-avatar" />
          <div>
            <span className="doctor-label">Your psychologist</span>
            <p className="doctor-name">{psychologist.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
          {/* Поле Ім'я */}
          <div className="input-field">
            <input type="text" placeholder="Name" {...register('name')} />
            {errors.name && <span className="error-msg">{errors.name.message}</span>}
          </div>

          {/* Поля Телефон та Час у два стовпчики */}
          <div className="input-row">
            <div className="input-field">
              <input type="tel" placeholder="+380" {...register('phone')} />
              {errors.phone && <span className="error-msg">{errors.phone.message}</span>}
            </div>

            <div className="input-field">
              <select {...register('time')}>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
              </select>
              {errors.time && <span className="error-msg">{errors.time.message}</span>}
            </div>
          </div>

          {/* Поле Email */}
          <div className="input-field">
            <input type="email" placeholder="Email" {...register('email')} />
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>

          {/* Поле Коментар */}
          <div className="input-field">
            <textarea placeholder="Comment" rows="3" {...register('comment')}></textarea>
            {errors.comment && <span className="error-msg">{errors.comment.message}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};