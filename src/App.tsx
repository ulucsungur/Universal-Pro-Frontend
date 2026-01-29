import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/page';
import LoginPage from './pages/login/page';
import { Navbar } from './components/layout/Navbar';
import RegisterPage from './pages/register/page';
import AddListingPage from './pages/add-listing/page';
import ListingDetailPage from './pages/listing-detail/page';
import AddCategoryPage from './pages/admin/add-category/page';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617]">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-listing" element={<AddListingPage />} />
          <Route path="/admin/add-category" element={<AddCategoryPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
