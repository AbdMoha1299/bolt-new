import React, { useState } from 'react';
import { ArrowLeft, Download, Edit, Save, FileText } from 'lucide-react';
import { Router } from '../utils/router';
import { getCVData, saveCVData } from '../utils/storage';
import { generatePDF } from '../utils/pdfGenerator';
import ModerneTemplate from '../components/cv-templates/ModerneTemplate';
import ClassiqueTemplate from '../components/cv-templates/ClassiqueTemplate';
import CreatifTemplate from '../components/cv-templates/CreatifTemplate';
import MinimalisteTemplate from '../components/cv-templates/MinimalisteTemplate';
import { CVData } from '../types/cv';

const Preview: React.FC = () => {
  const router = Router.getInstance();
  const [cvData, setCvData] = useState<Partial<CVData>>(getCVData());
  const [isGenerating, setIsGenerating] = useState(false);

  const renderTemplate = () => {
    switch (cvData.selectedTemplate) {
      case 'moderne':
        return <ModerneTemplate data={cvData} />;
      case 'classique':
        return <ClassiqueTemplate data={cvData} />;
      case 'creatif':
        return <CreatifTemplate data={cvData} />;
      case 'minimaliste':
        return <MinimalisteTemplate data={cvData} />;
      default:
        return <ModerneTemplate data={cvData} />;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const fileName = `CV_${cvData.personalInfo?.firstName}_${cvData.personalInfo?.lastName}.pdf`;
      await generatePDF('cv-preview', fileName);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    saveCVData(cvData);
    alert('CV sauvegardé avec succès !');
  };

  if (!cvData.personalInfo?.firstName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aucune donnée de CV trouvée
          </h2>
          <p className="text-gray-600 mb-6">
            Veuillez d'abord créer votre CV pour pouvoir le prévisualiser.
          </p>
          <button
            onClick={() => router.navigate('create-cv')}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Créer mon CV
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.navigate('templates')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Changer de template
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.navigate('create-cv')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <Edit className="h-5 w-5 mr-2" />
                Modifier les données
              </button>

              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Download className="h-5 w-5 mr-2" />
                {isGenerating ? 'Génération...' : 'Télécharger PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Prévisualisation de votre CV
            </h1>
            <p className="text-gray-600">
              Template: <span className="font-medium capitalize">{cvData.selectedTemplate || 'Moderne'}</span>
            </p>
          </div>

          <div id="cv-preview" className="bg-white shadow-2xl rounded-lg overflow-hidden">
            {renderTemplate()}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Download className="h-5 w-5 mr-2 inline" />
                {isGenerating ? 'Génération en cours...' : 'Télécharger en PDF'}
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Votre CV sera téléchargé au format PDF haute qualité, prêt pour l'impression ou l'envoi par email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;