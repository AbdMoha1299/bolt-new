import React from 'react';
import { CVData } from '../../types/cv';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface ClassiqueTemplateProps {
  data: Partial<CVData>;
}

const ClassiqueTemplate: React.FC<ClassiqueTemplateProps> = ({ data }) => {
  const { personalInfo, education = [], experience = [], skills = [], languages = [] } = data;

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="border-b-4 border-gray-800 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          
          <div className="flex justify-center items-center space-x-6 text-gray-600 text-sm">
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

      <div className="p-8">
        {/* Summary */}
        {personalInfo?.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide border-b border-gray-300 pb-2">
              Profil professionnel
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && experience.some(exp => exp.title && exp.company) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
              Expérience professionnelle
            </h2>
            <div className="space-y-6">
              {experience.filter(exp => exp.title && exp.company).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-600">{exp.location}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed ml-4 pl-4 border-l-2 border-gray-200">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && education.some(edu => edu.degree && edu.institution) && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
              Formation
            </h2>
            <div className="space-y-4">
              {education.filter(edu => edu.degree && edu.institution).map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700 font-medium">{edu.institution}</p>
                      {edu.location && (
                        <p className="text-sm text-gray-600">{edu.location}</p>
                      )}
                      {edu.description && (
                        <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Skills */}
          {skills.length > 0 && skills.some(skill => skill.name) && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.filter(skill => skill.name).map((skill) => (
                  <div key={skill.id} className="flex justify-between">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-600 font-medium">{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && languages.some(lang => lang.name) && (
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Langues
              </h2>
              <div className="space-y-2">
                {languages.filter(lang => lang.name).map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-gray-700">{lang.name}</span>
                    <span className="text-sm text-gray-600 font-medium">{lang.level}</span>
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

export default ClassiqueTemplate;