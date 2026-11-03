import { useState } from 'react';
import { AppointmentModal } from '../../src/components/AppointmentModal/AppointmentModal';

export const PsychologistCard = ({ data, isFavorite, onToggleFavorite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  const {
    name,
    avatar_url,
    experience,
    reviews,
    price_per_hour,
    rating,
    license,
    specialization,
    initial_consultation,
    about
  } = data;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      fontFamily: 'Inter, sans-serif',
      color: '#191A15',
      display: 'flex',
      gap: '24px'
    }}>
      <div style={{ position: 'relative', width: '96px', height: '96px', flexShrink: 0 }}>
        <img 
          src={avatar_url} 
          alt={name} 
          style={{ width: '100%', height: '100%', borderRadius: '15px', objectFit: 'cover', border: '2px solid #54BE96' }} 
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ color: '#8A8A89', fontSize: '16px', fontWeight: 500 }}>Psychologist</span>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '16px' }}>
            <span>⭐ Rating: {rating}</span>
            <span>Price / 1 hour: <strong style={{ color: '#38cd3e' }}>{price_per_hour}$</strong></span>
            <button 
              onClick={onToggleFavorite} 
              style={{ background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', padding: 0 }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 500, margin: '0 0 16px 0' }}>{name}</h2>

        <ul style={{ 
          listStyle: 'none', 
          padding: '12px', 
          margin: '0 0 16px 0', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          backgroundColor: '#F3F3F3', 
          borderRadius: '12px',
          fontSize: '16px'
        }}>
          <li>Specialization: <strong style={{ color: '#191A15' }}>{specialization}</strong></li>
          <li>• Experience: <strong style={{ color: '#191A15' }}>{experience}</strong></li>
          <li>• License: <strong style={{ color: '#191A15' }}>{license}</strong></li>
          <li>• Initial consultation: <strong style={{ color: '#191A15' }}>{initial_consultation}</strong></li>
        </ul>

        <p style={{ color: '#8A8A89', fontSize: '16px', lineHeight: '1.5', margin: '0 0 16px 0' }}>{about}</p>

        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#191A15', 
              textDecoration: 'underline', 
              cursor: 'pointer', 
              fontWeight: 500, 
              fontSize: '16px',
              padding: 0, 
              marginBottom: '24px' 
            }}
          >
            Read more
          </button>
        ) : (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 600 }}>Reviews:</h3>
            {reviews && reviews.length > 0 ? (
              reviews.map((rev, index) => (
                <div key={index} style={{ marginBottom: '16px', backgroundColor: '#FAFAFA', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '16px' }}>{rev.reviewer}</strong>
                    <span style={{ fontSize: '14px' }}>⭐ {rev.rating}</span>
                  </div>
                  <p style={{ color: '#8A8A89', fontSize: '14px', margin: 0 }}>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#8A8A89' }}>No reviews yet.</p>
            )}
          </div>
        )}

        <div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            style={{ 
              backgroundColor: '#54BE96', 
              color: '#FBFBFB', 
              border: 'none', 
              padding: '14px 32px', 
              borderRadius: '30px', 
              fontWeight: 600, 
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Make an appointment
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AppointmentModal 
          psychologist={data} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};