import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Benefits from './components/Benefits';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CreateCV from './pages/CreateCV';
import Templates from './pages/Templates';
import Preview from './pages/Preview';
import CreateLetter from './pages/CreateLetter';
import LetterPreview from './pages/LetterPreview';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AuthGuard from './components/AuthGuard';
import { Router, Route } from './utils/router';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const router = Router.getInstance();

  useEffect(() => {
    // Save user preferences to localStorage
    const preferences = {
      theme: 'light',
      language: 'fr',
      lastVisit: new Date().toISOString()
    };
    localStorage.setItem('boltcv-preferences', JSON.stringify(preferences));

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Subscribe to route changes
    const unsubscribe = router.subscribe((route) => {
      setCurrentRoute(route);
    });

    // Set initial route
    setCurrentRoute(router.getCurrentRoute());

    // Clean up on unmount
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      unsubscribe();
    };
  }, [router]);

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'create-cv':
        return (
          <AuthGuard>
            <CreateCV />
          </AuthGuard>
        );
      case 'templates':
        return (
          <AuthGuard>
            <Templates />
          </AuthGuard>
        );
      case 'preview':
        return (
          <AuthGuard>
            <Preview />
          </AuthGuard>
        );
      case 'create-letter':
        return (
          <AuthGuard>
            <CreateLetter />
          </AuthGuard>
        );
      case 'letter-preview':
        return (
          <AuthGuard>
            <LetterPreview />
          </AuthGuard>
        );
      case 'dashboard':
        return (
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        );
      case 'profile':
        return (
          <AuthGuard>
            <Profile />
          </AuthGuard>
        );
      default:
        return (
          <>
            <Hero />
            <Features />
            <Benefits />
            <Contact />
          </>
        );
    }
  };

  const isHomePage = currentRoute === 'home';
  const isAuthPage = ['login', 'register'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {!isAuthPage && <Header />}
      <main>
        {renderCurrentPage()}
      </main>
      {isHomePage && <Footer />}
    </div>
  );
}

export default App;