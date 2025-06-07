import React from 'react';
import { ArrowLeft, Eye, Download } from 'lucide-react';
import { cvTemplates } from '../data/templates';
import { saveCVData } from '../utils/storage';
import { Router } from '../utils/router';

const Templates: React.FC = () => {
  const router = Router.getInstance();

  const selectTemplate = (templateId: string) => {
    saveCVData({ selectedTemplate: templateId });
    router.navigate('preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.navigate('create-cv')}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              template
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sélectionnez le design qui correspond le mieux à votre profil professionnel 
            et à votre secteur d'activité.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cvTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => selectTemplate(template.id)}
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {template.name}
                  </h3>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${template.color}`}></div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                <button
                  onClick={() => selectTemplate(template.id)}
                  className={`w-full bg-gradient-to-r ${template.color} text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
                >
                  Utiliser ce template
                </button>
              </div>

              {/* Popular Badge */}
              {template.id === 'moderne' && (
                <div className="absolute top-4 right-4 bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Populaire
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Voici quelques conseils pour sélectionner le template qui vous convient le mieux.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Moderne</h4>
              <p className="text-sm text-gray-600">
                Idéal pour les secteurs tech, créatifs et startups
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Classique</h4>
              <p className="text-sm text-gray-600">
                Parfait pour les métiers traditionnels et corporate
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Créatif</h4>
              <p className="text-sm text-gray-600">
                Pour les designers, artistes et métiers créatifs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Minimaliste</h4>
              <p className="text-sm text-gray-600">
                Simple et efficace pour tous les secteurs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;