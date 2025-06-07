import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, Save, Trash2, Loader, AlertCircle, CheckCircle, Settings, Moon, Sun, Globe } from 'lucide-react';
import { Router } from '../utils/router';
import { getCurrentAuthState, updateUserProfile, changePassword, deleteAccount, logout } from '../utils/auth';
import { User as UserType } from '../types/auth';

const Profile: React.FC = () => {
  const router = Router.getInstance();
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences' | 'danger'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences form
  const [preferencesForm, setPreferencesForm] = useState({
    theme: 'light' as 'light' | 'dark',
    language: 'fr' as 'fr' | 'en',
    emailNotifications: true
  });

  useEffect(() => {
    const authState = getCurrentAuthState();
    if (!authState.isAuthenticated || !authState.user) {
      router.navigate('login');
      return;
    }
    
    setUser(authState.user);
    setProfileForm({
      firstName: authState.user.firstName,
      lastName: authState.user.lastName,
      email: authState.user.email
    });
    setPreferencesForm(authState.user.preferences);
  }, [router]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = updateUserProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email
      });

      if (updatedUser) {
        setUser(updatedUser);
        showMessage('success', 'Profil mis à jour avec succès');
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Les nouveaux mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      if (result.success) {
        showMessage('success', 'Mot de passe modifié avec succès');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showMessage('error', result.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      showMessage('error', 'Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = updateUserProfile({
        preferences: preferencesForm
      });

      if (updatedUser) {
        setUser(updatedUser);
        showMessage('success', 'Préférences mises à jour avec succès');
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la mise à jour des préférences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      'Cette action supprimera définitivement votre compte et toutes vos données. Tapez "SUPPRIMER" pour confirmer :'
    );

    if (confirmation !== 'SUPPRIMER') {
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteAccount();
      
      if (result.success) {
        showMessage('success', 'Compte supprimé avec succès');
        setTimeout(() => {
          router.navigate('home');
        }, 2000);
      } else {
        showMessage('error', result.error || 'Erreur lors de la suppression du compte');
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la suppression du compte');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'password', name: 'Mot de passe', icon: Lock },
    { id: 'preferences', name: 'Préférences', icon: Settings },
    { id: 'danger', name: 'Zone de danger', icon: Trash2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.navigate('dashboard')}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au tableau de bord
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mon{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Profil
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Informations personnelles
                </h3>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de famille
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Changer de mot de passe
                </h3>
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Changer le mot de passe
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Préférences de l'application
                </h3>
                
                <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Moon className="h-4 w-4 inline mr-2" />
                      Thème
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={preferencesForm.theme === 'light'}
                          onChange={(e) => setPreferencesForm(prev => ({ ...prev, theme: e.target.value as any }))}
                          className="mr-3"
                          disabled={isLoading}
                        />
                        <Sun className="h-4 w-4 mr-2" />
                        Clair
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={preferencesForm.theme === 'dark'}
                          onChange={(e) => setPreferencesForm(prev => ({ ...prev, theme: e.target.value as any }))}
                          className="mr-3"
                          disabled={isLoading}
                        />
                        <Moon className="h-4 w-4 mr-2" />
                        Sombre
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Globe className="h-4 w-4 inline mr-2" />
                      Langue
                    </label>
                    <select
                      value={preferencesForm.language}
                      onChange={(e) => setPreferencesForm(prev => ({ ...prev, language: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferencesForm.emailNotifications}
                        onChange={(e) => setPreferencesForm(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">
                        Recevoir les notifications par email
                      </span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Sauvegarder les préférences
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Danger Tab */}
            {activeTab === 'danger' && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-6">
                  Zone de danger
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">
                      Supprimer mon compte
                    </h4>
                    <p className="text-red-700 mb-4">
                      Cette action supprimera définitivement votre compte et toutes vos données 
                      (CV, lettres de motivation, préférences). Cette action est irréversible.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="h-5 w-5 mr-2 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        <>
                          
                          <Trash2 className="h-5 w-5 mr-2" />
                          Supprimer mon compte
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-orange-800 mb-2">
                      Se déconnecter
                    </h4>
                    <p className="text-orange-700 mb-4">
                      Déconnectez-vous de votre session actuelle.
                    </p>
                    <button
                      onClick={logout}
                      className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors duration-200 flex items-center"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center space-x-3">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p>{message.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;