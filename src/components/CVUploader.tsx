import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { extractDataFromFile, ExtractedCVData } from '../utils/cvExtractor';

interface CVUploaderProps {
  onDataExtracted: (data: ExtractedCVData) => void;
  onCancel: () => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onDataExtracted, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const isValidType = allowedTypes.includes(file.type) || 
                         file.name.endsWith('.pdf') || 
                         file.name.endsWith('.doc') || 
                         file.name.endsWith('.docx');

      if (!isValidType) {
        throw new Error('Format de fichier non supporté. Veuillez utiliser un fichier PDF ou Word (.doc, .docx).');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux. Taille maximum : 10MB.');
      }

      console.log('Processing file:', file.name, file.type);
      const extractedData = await extractDataFromFile(file);
      console.log('Extracted data:', extractedData);
      
      onDataExtracted(extractedData);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement du fichier');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Importer un CV externe
        </h3>
        <p className="text-gray-600">
          Uploadez votre CV en PDF ou Word pour extraire automatiquement les données
        </p>
      </div>

      {isProcessing ? (
        <div className="text-center py-12">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Analyse en cours...
          </h4>
          <p className="text-gray-600">
            Extraction des données de votre CV, veuillez patienter.
          </p>
        </div>
      ) : (
        <>
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Glissez-déposez votre CV ici
            </h4>
            <p className="text-gray-600 mb-4">
              ou cliquez pour sélectionner un fichier
            </p>
            
            <input
              type="file"
              id="cv-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <label
              htmlFor="cv-upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FileText className="h-5 w-5 mr-2" />
              Sélectionner un fichier
            </label>
          </div>

          {/* Supported Formats */}
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <FileText className="h-4 w-4" />
              <span className="text-sm">PDF</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Word (.doc)</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Word (.docx)</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">Erreur</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Fonctionnement</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Extraction automatique des informations principales</li>
                  <li>• Possibilité de corriger et compléter les données</li>
                  <li>• Génération immédiate de la lettre de motivation</li>
                  <li>• Fichiers supportés : PDF, Word (.doc, .docx)</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          disabled={isProcessing}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default CVUploader;