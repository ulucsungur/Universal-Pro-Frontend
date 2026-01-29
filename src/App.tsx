import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/page';
import LoginPage from './pages/login/page';
import RegisterPage from './pages/register/page';
import { Navbar } from './components/layout/Navbar';
import AddListingPage from './pages/add-listing/page';
import AddCategoryPage from './pages/admin/add-category/page';
import CategoryPage from './pages/category-detail/page';
import ListingDetailPage from './pages/listing-detail/page';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#020617]">
        <Navbar />
        <Routes>
          {/* 1. Statik Yollar (Öncelikli) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🚀 BU BUTONUN AÇACAĞI KAPI */}
          <Route path="/add-listing" element={<AddListingPage />} />
          <Route path="/admin/add-category" element={<AddCategoryPage />} />

          {/* 2. Dinamik Yollar (En Alt) */}
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
