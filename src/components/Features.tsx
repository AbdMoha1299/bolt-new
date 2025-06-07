import React from 'react';
import { FileText, Brain, Palette, Download, Cloud, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "CV Professionnels",
      description: "Créez des CV modernes et attractifs avec nos templates optimisés pour le marché nigérien.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Brain,
      title: "Lettres IA",
      description: "Notre intelligence artificielle génère des lettres de motivation personnalisées et convaincantes.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Palette,
      title: "Templates Modernes",
      description: "Plus de 50 designs professionnels adaptés à tous les secteurs d'activité.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  const additionalFeatures = [
    {
      icon: Download,
      title: "Export PDF Haute Qualité",
      description: "Téléchargez vos CV en PDF optimisé pour l'impression et l'envoi électronique."
    },
    {
      icon: Cloud,
      title: "Sauvegarde Cloud",
      description: "Vos données sont sécurisées et accessibles depuis n'importe quel appareil."
    },
    {
      icon: Shield,
      title: "100% Sécurisé",
      description: "Protection de vos données personnelles avec un chiffrement de niveau bancaire."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Intelligentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez tous les outils dont vous avez besoin pour créer un CV qui vous démarque 
            et décrocher l'emploi de vos rêves.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bgColor} rounded-full opacity-10 transform translate-x-8 -translate-y-8`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Et bien plus encore...
            </h3>
            <p className="text-lg text-gray-600">
              Profitez de toutes ces fonctionnalités avancées pour optimiser votre recherche d'emploi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;