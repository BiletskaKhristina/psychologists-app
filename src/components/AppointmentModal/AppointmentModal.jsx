import { useState, useEffect, useRef } from 'react';
import { X, Clock, ChevronDown } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './AppointmentModal.css';

const appointmentSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .matches(/^\+?[0-9\s\-()]{10,15}$/, 'Invalid phone number')
    .required('Phone is required'),
  time: yup.string().required('Meeting time is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  comment: yup.string().max(500, 'Comment is too long')
});

export const AppointmentModal = ({ isOpen, onClose, psychologist }) => {
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      name: '',
      phone: '+380 ',
      time: '',
      email: '',
      comment: ''
    }
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsTimeDropdownOpen(false);
      }
    };
    if (isTimeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTimeDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !psychologist) return null;

  const onSubmit = async (data) => {
    try {
      console.log('Appointment booked data:', data);
      alert('Appointment successfully booked!');
      reset();
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="appointment-modal-container">
        
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <h2 className="appointment-modal-title">Make an appointment with a psychologist</h2>
        <p className="appointment-modal-subtitle">
          You are on the verge of changing your life for the better. Fill out the short form below to book your personal consultation. We value your privacy and confidentiality.
        </p>

        <div className="appointment-doctor-info">
          <img 
            src={psychologist.avatar_url || psychologist.avatar} 
            alt={psychologist.name} 
            className="appointment-doctor-avatar" 
          />
          <div className="appointment-doctor-meta">
            <span className="appointment-doctor-label">Your psychologist</span>
            <h3 className="appointment-doctor-name">{psychologist.name}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
          <div className="appointment-field">
            <input 
              {...register('name')} 
              type="text" 
              placeholder="Name" 
              className="appointment-input" 
            />
            {errors.name && <span className="appointment-error">{errors.name.message}</span>}
          </div>

          <div className="appointment-row-two">
            <div className="appointment-field">
              <input 
                {...register('phone')} 
                type="text" 
                placeholder="+380" 
                className="appointment-input" 
              />
              {errors.phone && <span className="appointment-error">{errors.phone.message}</span>}
            </div>

            <div className="appointment-field time-field-wrapper" ref={dropdownRef}>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <div 
                    className="appointment-input time-select-trigger"
                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  >
                    <span className={field.value ? 'time-selected' : 'time-placeholder'}>
                      {field.value || '00:00'}
                    </span>
                    <div className="time-icons-box">
                      <Clock size={16} color="#191A15" />
                      <ChevronDown size={16} color="#191A15" className={`time-chevron ${isTimeDropdownOpen ? 'open' : ''}`} />
                    </div>
                  </div>
                )}
              />

              {isTimeDropdownOpen && (
                <div className="time-dropdown-list">
                  <div className="time-dropdown-header">Meeting time</div>
                  <div className="time-slots-grid">
                    {timeSlots.map((slot) => (
                      <div 
                        key={slot} 
                        className="time-slot-item"
                        onClick={() => {
                          setValue('time', slot, { shouldValidate: true });
                          setIsTimeDropdownOpen(false);
                        }}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.time && <span className="appointment-error">{errors.time.message}</span>}
            </div>
          </div>

          <div className="appointment-field">
            <input 
              {...register('email')} 
              type="email" 
              placeholder="Email" 
              className="appointment-input" 
            />
            {errors.email && <span className="appointment-error">{errors.email.message}</span>}
          </div>

          <div className="appointment-field">
            <textarea 
              {...register('comment')} 
              placeholder="Comment" 
              className="appointment-textarea" 
            />
            {errors.comment && <span className="appointment-error">{errors.comment.message}</span>}
          </div>

          <button type="submit" className="appointment-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>

      </div>
    </div>
  );
};