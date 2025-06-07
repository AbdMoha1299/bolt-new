import React from 'react';
import { CVData } from '../../types/cv';
import { Mail, Phone, MapPin, Star } from 'lucide-react';

interface CreatifTemplateProps {
  data: Partial<CVData>;
}

const CreatifTemplate: React.FC<CreatifTemplateProps> = ({ data }) => {
  const { personalInfo, education = [], experience = [], skills = [], languages = [] } = data;

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
  };

  const getLevelStars = (level: string): number => {
    switch (level) {
      case 'Expert':
      case 'Natif':
        return 5;
      case 'Avancé':
        return 4;
      case 'Intermédiaire':
        return 3;
      default:
        return 2;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-gradient-to-br from-orange-500 to-red-500 text-white p-8">
          {/* Profile */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {personalInfo?.firstName?.[0]}{personalInfo?.lastName?.[0]}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {personalInfo?.firstName}
              <br />
              {personalInfo?.lastName}
            </h1>
          </div>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 bg-white/20 rounded-lg p-2 text-center">
              CONTACT
            </h2>
            <div className="space-y-3 text-sm">
              {personalInfo?.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo?.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {(personalInfo?.city || personalInfo?.country) && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span>
                    {personalInfo?.city}{personalInfo?.city && personalInfo?.country && ', '}{personalInfo?.country}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && skills.some(skill => skill.name) && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 bg-white/20 rounded-lg p-2 text-center">
                COMPÉTENCES
              </h2>
              <div className="space-y-3">
                {skills.filter(skill => skill.name).map((skill) => (
                  <div key={skill.id}>
                    <div className="text-sm font-medium mb-1">{skill.name}</div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < getLevelStars(skill.level)
                              ? 'text-yellow-300 fill-current'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && languages.some(lang => lang.name) && (
            <section>
              <h2 className="text-lg font-bold mb-4 bg-white/20 rounded-lg p-2 text-center">
                LANGUES
              </h2>
              <div className="space-y-3">
                {languages.filter(lang => lang.name).map((lang) => (
                  <div key={lang.id}>
                    <div className="text-sm font-medium mb-1">{lang.name}</div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < getLevelStars(lang.level)
                              ? 'text-yellow-300 fill-current'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Summary */}
          {personalInfo?.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-orange-600 mb-4 relative">
                PROFIL
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && experience.some(exp => exp.title && exp.company) && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-orange-600 mb-4 relative">
                EXPÉRIENCE
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              </h2>
              <div className="space-y-6">
                {experience.filter(exp => exp.title && exp.company).map((exp) => (
                  <div key={exp.id} className="relative pl-8">
                    <div className="absolute left-0 top-2 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                    <div className="absolute left-2 top-6 w-px h-full bg-gray-200"></div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-orange-600 font-medium">{exp.company}</p>
                          {exp.location && (
                            <p className="text-sm text-gray-600">{exp.location}</p>
                          )}
                        </div>
                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && education.some(edu => edu.degree && edu.institution) && (
            <section>
              <h2 className="text-2xl font-bold text-orange-600 mb-4 relative">
                FORMATION
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              </h2>
              <div className="space-y-4">
                {education.filter(edu => edu.degree && edu.institution).map((edu) => (
                  <div key={edu.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-orange-600 font-medium">{edu.institution}</p>
                        {edu.location && (
                          <p className="text-sm text-gray-600">{edu.location}</p>
                        )}
                        {edu.description && (
                          <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                        )}
                      </div>
                      <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </div>
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

export default CreatifTemplate;