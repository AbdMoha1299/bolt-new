import React, { useState, useEffect } from 'react';
import { FileText, Mail, Plus, Eye, Download, Trash2, Calendar, Building, Users, BarChart3, TrendingUp } from 'lucide-react';
import { Router } from '../utils/router';
import { getCVData, saveCVData } from '../utils/storage';
import { getStoredLetters, deleteLetterById } from '../utils/letterGenerator';
import { getCurrentAuthState } from '../utils/auth';
import { LetterData } from '../types/letter';

const Dashboard: React.FC = () => {
  const router = Router.getInstance();
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [user, setUser] = useState<any>(null);
  const cvData = getCVData();

  useEffect(() => {
    const authState = getCurrentAuthState();
    if (authState.isAuthenticated && authState.user) {
      setUser(authState.user);
    }
    setLetters(getStoredLetters());
  }, []);

  const handleCreateLetterFromCV = () => {
    if (cvData.personalInfo?.firstName) {
      router.navigate('create-letter');
    } else {
      alert('Veuillez d\'abord créer un CV avant de générer une lettre.');
    }
  };

  const handleViewLetter = (letterId: string) => {
    localStorage.setItem('current-letter-id', letterId);
    router.navigate('letter-preview');
  };

  const handleDeleteLetter = (letterId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette lettre ?')) {
      deleteLetterById(letterId);
      setLetters(getStoredLetters());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getStats = () => {
    const totalDocuments = (cvData.personalInfo?.firstName ? 1 : 0) + letters.length;
    const recentLetters = letters.filter(letter => {
      const letterDate = new Date(letter.generatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return letterDate > weekAgo;
    }).length;

    return {
      totalDocuments,
      totalLetters: letters.length,
      recentLetters,
      hasCV: !!cvData.personalInfo?.firstName
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {getGreeting()}{user ? `, ${user.firstName}` : ''} ! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Gérez vos CV et lettres de motivation depuis votre tableau de bord
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total documents</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lettres créées</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalLetters}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cette semaine</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recentLetters}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Statut CV</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.hasCV ? 'Complet' : 'À créer'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stats.hasCV ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <BarChart3 className={`h-6 w-6 ${
                  stats.hasCV ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* CV Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Mon CV
              </h2>
              {cvData.personalInfo?.firstName && (
                <button
                  onClick={() => router.navigate('create-cv')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Modifier
                </button>
              )}
            </div>

            {cvData.personalInfo?.firstName ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      CV
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                      </h3>
                      <p className="text-gray-600">{cvData.personalInfo.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Template: <span className="capitalize">{cvData.selectedTemplate || 'Moderne'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => router.navigate('preview')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </button>
                  <button
                    onClick={() => router.navigate('templates')}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Template
                  </button>
                  <button
                    onClick={handleCreateLetterFromCV}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center text-sm"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Lettre
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun CV créé
                </h3>
                <p className="text-gray-600 mb-6">
                  Créez votre premier CV pour commencer
                </p>
                <button
                  onClick={() => router.navigate('create-cv')}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2 inline" />
                  Créer mon CV
                </button>
              </div>
            )}
          </div>

          {/* Letters Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Mail className="h-6 w-6 mr-3 text-green-600" />
                Mes Lettres
                {letters.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {letters.length}
                  </span>
                )}
              </h2>
              <button
                onClick={() => router.navigate('create-letter')}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Nouvelle
              </button>
            </div>

            {letters.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {letters.slice(0, 5).map((letter) => (
                  <div key={letter.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {letter.jobTitle}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building className="h-3 w-3 mr-1" />
                          {letter.companyName}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(letter.generatedAt)}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewLetter(letter.id)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLetter(letter.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {letters.length > 5 && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">
                      +{letters.length - 5} autres lettres
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucune lettre créée
                </h3>
                <p className="text-gray-600 mb-6">
                  Générez votre première lettre de motivation
                </p>
                <button
                  onClick={() => router.navigate('create-letter')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2 inline" />
                  Créer une lettre
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Actions rapides
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => router.navigate('create-cv')}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-center group"
            >
              <FileText className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold mb-2">
                {cvData.personalInfo?.firstName ? 'Modifier CV' : 'Créer un CV'}
              </h3>
              <p className="text-sm opacity-90">
                {cvData.personalInfo?.firstName ? 'Mettre à jour votre CV' : 'Nouveau CV professionnel'}
              </p>
            </button>

            <button
              onClick={() => router.navigate('create-letter')}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-center group"
            >
              <Mail className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold mb-2">Lettre IA</h3>
              <p className="text-sm opacity-90">
                Lettre personnalisée
              </p>
            </button>

            <button
              onClick={() => router.navigate('templates')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-center group"
            >
              <FileText className="h-8 w-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold mb-2">Templates</h3>
              <p className="text-sm opacity-90">
                Explorer les designs
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        {(letters.length > 0 || cvData.personalInfo?.firstName) && (
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Activité récente
            </h2>
            <div className="space-y-4">
              {letters.slice(0, 3).map((letter) => (
                <div key={letter.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Lettre créée pour {letter.companyName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Poste: {letter.jobTitle} • {formatDate(letter.generatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewLetter(letter.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              {cvData.personalInfo?.firstName && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      CV créé pour {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Template: {cvData.selectedTemplate || 'Moderne'}
                    </p>
                  </div>
                  <button
                    onClick={() => router.navigate('preview')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;