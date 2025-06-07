import React from 'react';
import { Skill, Language } from '../../types/cv';
import { Code, Globe, Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../utils/storage';

interface SkillsStepProps {
  skills: Skill[];
  languages: Language[];
  onSkillsChange: (skills: Skill[]) => void;
  onLanguagesChange: (languages: Language[]) => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ 
  skills, 
  languages, 
  onSkillsChange, 
  onLanguagesChange 
}) => {
  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      level: 'Intermédiaire'
    };
    onSkillsChange([...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    onSkillsChange(skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onSkillsChange(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: generateId(),
      name: '',
      level: 'Intermédiaire'
    };
    onLanguagesChange([...languages, newLanguage]);
  };

  const removeLanguage = (id: string) => {
    onLanguagesChange(languages.filter(lang => lang.id !== id));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onLanguagesChange(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const skillLevels: Skill['level'][] = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  const languageLevels: Language['level'][] = ['Débutant', 'Intermédiaire', 'Avancé', 'Natif'];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Compétences & Langues
        </h2>
        <p className="text-gray-600">
          Mettez en valeur vos compétences techniques et linguistiques
        </p>
      </div>

      {/* Skills Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center mb-6">
          <Code className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Compétences techniques</h3>
        </div>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={skill.id} className="grid md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compétence {index + 1}
                </label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="ex: JavaScript, Marketing Digital, Gestion de projet..."
                />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau
                  </label>
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', e.target.value as Skill['level'])}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200 mt-8"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSkill}
            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 text-gray-600 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une compétence
          </button>
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Langues</h3>
        </div>

        <div className="space-y-4">
          {languages.map((language, index) => (
            <div key={language.id} className="grid md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue {index + 1}
                </label>
                <input
                  type="text"
                  value={language.name}
                  onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="ex: Français, Anglais, Haoussa..."
                />
              </div>

              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau
                  </label>
                  <select
                    value={language.level}
                    onChange={(e) => updateLanguage(language.id, 'level', e.target.value as Language['level'])}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    {languageLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(language.id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200 mt-8"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLanguage}
            className="w-full border-2 border-dashed border-gray-300 hover:border-green-500 rounded-xl p-4 text-gray-600 hover:text-green-600 transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une langue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;