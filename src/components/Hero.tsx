import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Router } from '../utils/router';

const Hero: React.FC = () => {
  const router = Router.getInstance();

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startCreatingCV = () => {
    router.navigate('create-cv');
  };

  return (
    <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 text-sm font-medium mb-6 animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
                Spécialement conçu pour les jeunes Nigériens
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Créez votre{' '}
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  CV professionnel
                </span>{' '}
                en quelques minutes
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Générateur intelligent de CV et lettres de motivation avec IA. 
                Démarquez-vous sur le marché du travail avec des templates modernes 
                et un contenu optimisé.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button 
                  onClick={startCreatingCV}
                  className="group bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                >
                  Créer mon CV gratuitement
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button 
                  onClick={scrollToFeatures}
                  className="text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                >
                  Découvrir les fonctionnalités
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600">Gratuit</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Templates</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-orange-600">IA</div>
                  <div className="text-sm text-gray-600">Intégrée</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-green-200 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl transform -rotate-6 opacity-20"></div>
              
              {/* Main content */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
                {/* Mock CV Preview */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded-md mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-md w-2/3"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-2 bg-blue-200 rounded-full w-full"></div>
                    <div className="h-2 bg-green-200 rounded-full w-5/6"></div>
                    <div className="h-2 bg-orange-200 rounded-full w-4/6"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                  PDF
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  IA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;