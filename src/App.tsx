import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/page';
import LoginPage from './pages/login/page';
import RegisterPage from './pages/register/page';
import { Navbar } from './components/layout/Navbar';
import AddListingPage from './pages/add-listing/page';
import AddCategoryPage from './pages/admin/add-category/page';
import AddBannerPage from './pages/admin/add-banner/page';
import CategoryPage from './pages/category-detail/page';
import ListingDetailPage from './pages/listing-detail/page';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        {/* 🚀 grow sınıfı eklendi (Tailwind v4 standardı) */}
        <div className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add-listing" element={<AddListingPage />} />
            <Route path="/admin/add-category" element={<AddCategoryPage />} />
            <Route path="/admin/add-banner" element={<AddBannerPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
