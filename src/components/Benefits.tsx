import React from 'react';
import { Check, Star, Zap, Users } from 'lucide-react';

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Star,
      title: "100% Gratuit",
      description: "Accès complet à toutes les fonctionnalités sans frais cachés ni abonnement.",
      highlight: true
    },
    {
      icon: Zap,
      title: "Interface Simple",
      description: "Interface intuitive conçue pour une création rapide et efficace de CV.",
      highlight: false
    },
    {
      icon: Check,
      title: "Export PDF",
      description: "Téléchargement instantané en format PDF haute qualité prêt à imprimer.",
      highlight: false
    },
    {
      icon: Users,
      title: "Sauvegarde Cloud",
      description: "Vos CV sont automatiquement sauvegardés et accessibles partout.",
      highlight: true
    }
  ];

  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Étudiante en Commerce",
      text: "Grâce à Bolt CV, j'ai décroché mon stage de rêve ! L'interface est très simple à utiliser.",
      avatar: "AD"
    },
    {
      name: "Ibrahim Moussa",
      role: "Développeur Junior",
      text: "Les templates sont modernes et professionnels. J'ai reçu plusieurs appels après avoir envoyé mon CV.",
      avatar: "IM"
    },
    {
      name: "Fatima Hassan",
      role: "Marketing Digital",
      text: "L'IA pour les lettres de motivation est révolutionnaire. Plus besoin de chercher les mots !",
      avatar: "FH"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Bolt CV ?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rejoignez des milliers de jeunes Nigériens qui ont déjà transformé leur recherche d'emploi 
            avec nos outils innovants.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 group ${
                benefit.highlight 
                  ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-2xl' 
                  : 'bg-white shadow-lg hover:shadow-xl border border-gray-100'
              }`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 ${
                benefit.highlight 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-r from-blue-100 to-green-100'
              }`}>
                <benefit.icon className={`h-6 w-6 ${
                  benefit.highlight ? 'text-white' : 'text-blue-600'
                }`} />
              </div>

              {/* Content */}
              <h3 className={`text-xl font-bold mb-3 ${
                benefit.highlight ? 'text-white' : 'text-gray-900'
              }`}>
                {benefit.title}
              </h3>
              <p className={`${
                benefit.highlight ? 'text-white/90' : 'text-gray-600'
              }`}>
                {benefit.description}
              </p>

              {/* Highlight badge */}
              {benefit.highlight && (
                <div className="absolute -top-3 -right-3 bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  Populaire
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h3>
            <p className="text-lg text-gray-600">
              Découvrez les témoignages de jeunes qui ont réussi grâce à Bolt CV.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-100 group hover:shadow-lg transition-all duration-300"
              >
                {/* Quote */}
                <div className="mb-6">
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex mt-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Prêt à créer votre CV parfait ?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers de jeunes qui ont déjà transformé leur carrière.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 inline-flex items-center">
              Commencer maintenant
              <Check className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;