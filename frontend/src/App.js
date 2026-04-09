import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout Components
import NavBar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections (single-page scroll)
import HomePage from './pages/HomePage';

// Admin (separate pages)
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

// Shared UI
import WhatsAppButton from './components/ui/WhatsAppButton';
import ScrollToTop from './components/ui/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <main>
          <Routes>
            {/* Single-page scroll — all sections on one page */}
            <Route path="/" element={<HomePage />} />

            {/* Admin stays as separate pages */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;