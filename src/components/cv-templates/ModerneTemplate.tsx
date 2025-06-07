import React from 'react';
import { CVData } from '../../types/cv';
import { Mail, Phone, MapPin, Calendar, Globe } from 'lucide-react';

interface ModerneTemplateProps {
  data: Partial<CVData>;
}

const ModerneTemplate: React.FC<ModerneTemplateProps> = ({ data }) => {
  const { personalInfo, education = [], experience = [], skills = [], languages = [] } = data;

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Expert':
      case 'Natif':
        return 'w-full bg-green-500';
      case 'Avancé':
        return 'w-4/5 bg-blue-500';
      case 'Intermédiaire':
        return 'w-3/5 bg-orange-500';
      default:
        return 'w-2/5 bg-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {personalInfo?.firstName?.[0]}{personalInfo?.lastName?.[0]}
            </span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h1>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {personalInfo?.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {personalInfo.email}
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {personalInfo.phone}
                </div>
              )}
              {(personalInfo?.city || personalInfo?.country) && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {personalInfo?.city}{personalInfo?.city && personalInfo?.country && ', '}{personalInfo?.country}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Summary */}
          {personalInfo?.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
                Profil professionnel
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && experience.some(exp => exp.title && exp.company) && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
                Expérience professionnelle
              </h2>
              <div className="space-y-6">
                {experience.filter(exp => exp.title && exp.company).map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-2"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-600">{exp.location}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && education.some(edu => edu.degree && edu.institution) && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
                Formation
              </h2>
              <div className="space-y-4">
                {education.filter(edu => edu.degree && edu.institution).map((edu) => (
                  <div key={edu.id} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-2 top-2"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-green-600 font-medium">{edu.institution}</p>
                        {edu.location && (
                          <p className="text-sm text-gray-600">{edu.location}</p>
                        )}
                        {edu.description && (
                          <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-50 p-8">
          {/* Skills */}
          {skills.length > 0 && skills.some(skill => skill.name) && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Compétences</h2>
              <div className="space-y-4">
                {skills.filter(skill => skill.name).map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${getLevelColor(skill.level)}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && languages.some(lang => lang.name) && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Langues
              </h2>
              <div className="space-y-4">
                {languages.filter(lang => lang.name).map((lang) => (
                  <div key={lang.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                      <span className="text-xs text-gray-500">{lang.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${getLevelColor(lang.level)}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerneTemplate;