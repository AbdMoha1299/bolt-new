import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Edit, Save, RefreshCw, FileText } from 'lucide-react';
import { Router } from '../utils/router';
import { getLetterById, saveLetter } from '../utils/letterGenerator';
import { generatePDF } from '../utils/pdfGenerator';
import { LetterData } from '../types/letter';

const LetterPreview: React.FC = () => {
  const router = Router.getInstance();
  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLetter = () => {
      // Try to get letter ID from localStorage first (for new letters)
      let letterId = localStorage.getItem('current-letter-id');
      
      // If not found, try from history state (for existing letters)
      if (!letterId) {
        letterId = window.history.state?.letterId;
      }
      
      console.log('Loading letter with ID:', letterId);
      
      if (letterId) {
        const letter = getLetterById(letterId);
        console.log('Found letter:', letter);
        
        if (letter) {
          setLetterData(letter);
          setEditedContent(letter.content);
          
          // Clean up the temporary storage
          localStorage.removeItem('current-letter-id');
        } else {
          console.error('Letter not found with ID:', letterId);
        }
      } else {
        console.error('No letter ID found');
      }
      
      setIsLoading(false);
    };

    // Add a small delay to ensure the letter is saved before trying to load it
    const timeoutId = setTimeout(loadLetter, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSave = async () => {
    if (!letterData) return;

    setIsSaving(true);
    try {
      const updatedLetter: LetterData = {
        ...letterData,
        content: editedContent,
        lastModified: new Date().toISOString()
      };
      
      saveLetter(updatedLetter);
      setLetterData(updatedLetter);
      setIsEditing(false);
      alert('Lettre sauvegardée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const fileName = `Lettre_${letterData?.companyName}_${letterData?.jobTitle}.pdf`;
      await generatePDF('letter-content', fileName);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    // In a real app, this would call the AI again
    alert('Fonctionnalité de régénération bientôt disponible !');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chargement de votre lettre...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter quelques instants.
          </p>
        </div>
      </div>
    );
  }

  if (!letterData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lettre non trouvée
          </h2>
          <p className="text-gray-600 mb-6">
            La lettre demandée n'existe pas ou a été supprimée.
          </p>
          <button
            onClick={() => router.navigate('dashboard')}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Retour au tableau de bord
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
                onClick={() => router.navigate('dashboard')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Tableau de bord
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRegenerate}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Régénérer
              </button>

              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Modifier
                </button>
              )}

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

      {/* Letter Content */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lettre de motivation
            </h1>
            <p className="text-gray-600">
              {letterData.companyName} - {letterData.jobTitle}
            </p>
          </div>

          <div id="letter-content" className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="p-12">
              {isEditing ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  style={{ minHeight: '600px' }}
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                    {letterData.content}
                  </pre>
                </div>
              )}
            </div>
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
              Votre lettre sera téléchargée au format PDF haute qualité, prêt pour l'envoi.
            </p>
          </div>

          {/* Letter Info */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations de la lettre
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Poste:</span>
                <span className="ml-2 text-gray-600">{letterData.jobTitle}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Entreprise:</span>
                <span className="ml-2 text-gray-600">{letterData.companyName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Secteur:</span>
                <span className="ml-2 text-gray-600">{letterData.sector}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">
                  {letterData.applicationType === 'offre' ? 'Réponse à offre' : 
                   letterData.applicationType === 'spontanee' ? 'Candidature spontanée' : 'Demande de stage'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Créée le:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(letterData.generatedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Modifiée le:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(letterData.lastModified).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterPreview;