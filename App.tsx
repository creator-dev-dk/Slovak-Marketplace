import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import UserProfile from './pages/UserProfile';
import Chat from './pages/Chat';
import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';
import { useAppStore } from './store/useStore';

const App: React.FC = () => {
  const { fetchListings, checkSession } = useAppStore();

  useEffect(() => {
    checkSession();
    fetchListings();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AuthModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;