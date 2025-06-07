import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, FileText, Upload, Sparkles, User, Loader } from 'lucide-react';
import { Router } from '../utils/router';
import { getCVData } from '../utils/storage';
import { createLetterFromCV, saveLetter } from '../utils/letterGenerator';
import { LetterGenerationRequest } from '../types/letter';
import CVUploader from '../components/CVUploader';
import CVDataEditor from '../components/CVDataEditor';
import { ExtractedCVData } from '../utils/cvExtractor';

const CreateLetter: React.FC = () => {
  const router = Router.getInstance();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCVData, setSelectedCVData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedCVData | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    sector: '',
    applicationType: 'offre' as 'offre' | 'spontanee' | 'stage'
  });

  const savedCVData = getCVData();

  const handleCVSelection = () => {
    if (savedCVData.personalInfo?.firstName) {
      setSelectedCVData(savedCVData);
      setCurrentStep(2);
    }
  };

  const handleExternalCVClick = () => {
    setShowUploader(true);
  };

  const handleDataExtracted = (data: ExtractedCVData) => {
    setExtractedData(data);
    setShowUploader(false);
    setShowEditor(true);
  };

  const handleDataConfirmed = (confirmedData: ExtractedCVData) => {
    // Convert extracted data to CV format
    const cvData = {
      personalInfo: confirmedData.personalInfo,
      education: confirmedData.education,
      experience: confirmedData.experience,
      skills: confirmedData.skills,
      languages: confirmedData.languages
    };
    
    setSelectedCVData(cvData);
    setShowEditor(false);
    setCurrentStep(2);
  };

  const handleCancelUpload = () => {
    setShowUploader(false);
    setShowEditor(false);
    setExtractedData(null);
  };

  const handleFormSubmit = async () => {
    console.log('Form submit clicked');
    console.log('Selected CV Data:', selectedCVData);
    console.log('Form Data:', formData);
    console.log('Form Valid:', isFormValid());

    if (!selectedCVData) {
      alert('Aucun CV sélectionné');
      return;
    }

    if (!isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Generating letter...');
      
      const generationRequest: Omit<LetterGenerationRequest, 'cvData'> = {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        jobDescription: formData.jobDescription,
        sector: formData.sector,
        applicationType: formData.applicationType
      };

      console.log('Generation request:', generationRequest);

      const letterData = createLetterFromCV(selectedCVData, generationRequest);
      console.log('Letter generated:', letterData);
      
      saveLetter(letterData);
      console.log('Letter saved');
      
      // Store letter ID temporarily for navigation
      localStorage.setItem('current-letter-id', letterData.id);
      
      // Navigate to preview
      router.navigate('letter-preview');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert(`Erreur lors de la génération de la lettre: ${error.message || error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    const valid = !!(formData.jobTitle && formData.companyName && formData.jobDescription && formData.sector);
    console.log('Form validation:', {
      jobTitle: !!formData.jobTitle,
      companyName: !!formData.companyName,
      jobDescription: !!formData.jobDescription,
      sector: !!formData.sector,
      overall: valid
    });
    return valid;
  };

  // Show uploader overlay
  if (showUploader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CVUploader
            onDataExtracted={handleDataExtracted}
            onCancel={handleCancelUpload}
          />
        </div>
      </div>
    );
  }

  // Show editor overlay
  if (showEditor && extractedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CVDataEditor
            data={extractedData}
            onSave={handleDataConfirmed}
            onCancel={handleCancelUpload}
          />
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Créer une{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              lettre de motivation
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Générez une lettre personnalisée basée sur votre CV
          </p>
        </div>

        {/* Step 1: CV Selection */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choisissez votre CV source
              </h2>
              <p className="text-gray-600">
                Sélectionnez le CV à utiliser pour générer votre lettre de motivation
              </p>
            </div>

            <div className="space-y-6">
              {/* Saved CV Option */}
              {savedCVData.personalInfo?.firstName ? (
                <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 transition-all duration-200 cursor-pointer group"
                     onClick={handleCVSelection}>
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform duration-200">
                      CV
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        CV - {savedCVData.personalInfo.firstName} {savedCVData.personalInfo.lastName}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {savedCVData.personalInfo.email}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        CV Bolt CV sauvegardé
                      </div>
                    </div>
                    <div className="text-blue-600 group-hover:text-green-600 transition-colors duration-200">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun CV sauvegardé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Créez d'abord un CV dans l'application ou importez un CV externe.
                  </p>
                  <button
                    onClick={() => router.navigate('create-cv')}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Créer mon CV
                  </button>
                </div>
              )}

              {/* Import External CV */}
              <div 
                className="border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-xl p-8 transition-all duration-200 cursor-pointer group"
                onClick={handleExternalCVClick}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Importer un CV externe
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Uploadez votre CV en PDF ou Word pour extraction automatique
                    </p>
                    <div className="flex items-center text-sm text-orange-600 font-medium">
                      <Upload className="h-4 w-4 mr-2" />
                      Supports PDF, Word (.doc, .docx)
                    </div>
                  </div>
                  <div className="text-orange-600 group-hover:text-red-600 transition-colors duration-200">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3">💡 Comment ça marche ?</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h5 className="font-medium mb-2">CV Bolt CV</h5>
                  <ul className="space-y-1">
                    <li>• Utilise les données déjà saisies</li>
                    <li>• Génération instantanée</li>
                    <li>• Toutes les informations disponibles</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">CV externe</h5>
                  <ul className="space-y-1">
                    <li>• Extraction automatique des données</li>
                    <li>• Possibilité de correction</li>
                    <li>• Formats PDF et Word supportés</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Job Information Form */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Informations sur le poste
              </h2>
              <p className="text-gray-600">
                Décrivez le poste pour lequel vous candidatez
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intitulé du poste *
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="ex: Développeur Web, Assistant Marketing..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="ex: Tech Solutions Niger"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d'activité *
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Sélectionnez un secteur</option>
                    <option value="Informatique/Tech">Informatique/Tech</option>
                    <option value="Marketing/Communication">Marketing/Communication</option>
                    <option value="Finance/Banque">Finance/Banque</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Santé">Santé</option>
                    <option value="Commerce/Vente">Commerce/Vente</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="ONG/Humanitaire">ONG/Humanitaire</option>
                    <option value="Administration">Administration</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de candidature *
                  </label>
                  <select
                    value={formData.applicationType}
                    onChange={(e) => handleInputChange('applicationType', e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="offre">Réponse à une offre d'emploi</option>
                    <option value="spontanee">Candidature spontanée</option>
                    <option value="stage">Demande de stage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de l'offre / vos motivations *
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Collez ici la description du poste ou décrivez vos motivations et les compétences recherchées..."
                  required
                />
              </div>
            </div>

            {/* CV Source Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-green-900 mb-2">CV source sélectionné:</h4>
              <p className="text-green-700">
                {selectedCVData?.personalInfo?.firstName} {selectedCVData?.personalInfo?.lastName} - {selectedCVData?.personalInfo?.email}
              </p>
            </div>

            {/* Validation Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-2">État de validation:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={`flex items-center ${formData.jobTitle ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: formData.jobTitle ? '#10b981' : '#ef4444'}}></span>
                  Intitulé du poste
                </div>
                <div className={`flex items-center ${formData.companyName ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: formData.companyName ? '#10b981' : '#ef4444'}}></span>
                  Nom entreprise
                </div>
                <div className={`flex items-center ${formData.sector ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: formData.sector ? '#10b981' : '#ef4444'}}></span>
                  Secteur
                </div>
                <div className={`flex items-center ${formData.jobDescription ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: formData.jobDescription ? '#10b981' : '#ef4444'}}></span>
                  Description
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            {isGenerating && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center space-x-3">
                  <Loader className="h-5 w-5 animate-spin text-green-600" />
                  <span className="text-green-700 font-medium">Génération de votre lettre en cours...</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
                disabled={isGenerating}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </button>

              <button
                onClick={handleFormSubmit}
                disabled={!isFormValid() || isGenerating}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Générer la lettre
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLetter;