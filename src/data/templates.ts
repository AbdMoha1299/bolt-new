import { CVTemplate } from '../types/cv';

export const cvTemplates: CVTemplate[] = [
  {
    id: 'moderne',
    name: 'Moderne',
    description: 'Design épuré avec des accents colorés, parfait pour les métiers créatifs et tech.',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    color: 'from-blue-500 to-green-500'
  },
  {
    id: 'classique',
    name: 'Classique',
    description: 'Format traditionnel et professionnel, idéal pour les secteurs corporate.',
    preview: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    color: 'from-gray-600 to-gray-800'
  },
  {
    id: 'creatif',
    name: 'Créatif',
    description: 'Design audacieux avec des éléments graphiques pour se démarquer.',
    preview: 'https://images.pexels.com/photos/5238645/pexels-photo-5238645.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'minimaliste',
    name: 'Minimaliste',
    description: 'Simplicité et élégance, focus sur le contenu essentiel.',
    preview: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=300&h=400',
    color: 'from-purple-500 to-pink-500'
  }
];