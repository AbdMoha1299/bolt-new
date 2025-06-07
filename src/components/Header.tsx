import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { Router } from '../utils/router';
import { getCurrentAuthState, logout } from '../utils/auth';
import { User as UserType } from '../types/auth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = Router.getInstance();

  useEffect(() => {
    const checkAuthState = () => {
      const authState = getCurrentAuthState();
      setIsAuthenticated(authState.isAuthenticated);
      setUser(authState.user);
    };

    checkAuthState();
    
    // Listen for route changes to update auth state
    const unsubscribe = router.subscribe(() => {
      checkAuthState();
    });

    return unsubscribe;
  }, [router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    if (router.getCurrentRoute() !== 'home') {
      router.navigate('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserMenuOpen(false);
  };

  const navigateTo = (route: 'home' | 'create-cv' | 'templates' | 'preview' | 'create-letter' | 'dashboard' | 'login' | 'register' | 'profile') => {
    router.navigate(route);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const getUserInitials = (user: UserType): string => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigateTo('home')}
          >
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Bolt CV
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => navigateTo('home')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Accueil
            </button>
            
            {/* Create Dropdown */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center"
                >
                  Créer
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <button
                      onClick={() => navigateTo('create-cv')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      Créer un CV
                    </button>
                    <button
                      onClick={() => navigateTo('create-letter')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      Créer une lettre
                    </button>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated && (
              <button
                onClick={() => navigateTo('dashboard')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Mes documents
              </button>
            )}

            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getUserInitials(user)}
                  </div>
                  <span className="text-gray-700 font-medium">{user.firstName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Tableau de bord
                    </button>
                    <button
                      onClick={() => navigateTo('profile')}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Profil
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Connexion
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <nav className="px-4 py-4 space-y-4">
              <button
                onClick={() => navigateTo('home')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
              >
                Accueil
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  >
                    Mes documents
                  </button>
                  <button
                    onClick={() => navigateTo('create-cv')}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  >
                    Créer un CV
                  </button>
                  <button
                    onClick={() => navigateTo('create-letter')}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  >
                    Créer une lettre
                  </button>
                  <button
                    onClick={() => navigateTo('profile')}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  >
                    Mon profil
                  </button>
                </>
              ) : null}

              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
              >
                Contact
              </button>

              <hr className="my-4" />

              {isAuthenticated && user ? (
                <>
                  <div className="py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {getUserInitials(user)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors duration-200 font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigateTo('login')}
                    className="block w-full text-left text-blue-600 hover:text-blue-700 font-medium py-2"
                  >
                    Connexion
                  </button>
                  <button 
                    onClick={() => navigateTo('register')}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;