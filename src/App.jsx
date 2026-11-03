import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/psychologists" element={<div style={{ padding: '40px', fontSize: '24px' }}>Psychologists Page</div>} />
      <Route path="/favorites" element={<div style={{ padding: '40px', fontSize: '24px' }}>Favorites Page</div>} />
    </Routes>
  );
}

export default App;