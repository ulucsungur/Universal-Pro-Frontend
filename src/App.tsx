import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/page';
import LoginPage from './pages/login/page';
import { Navbar } from './components/layout/Navbar';
import RegisterPage from './pages/register/page';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Yarın buraya /register ekleyeceğiz */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
