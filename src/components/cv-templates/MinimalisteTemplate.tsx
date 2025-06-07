import React from 'react';
import { CVData } from '../../types/cv';

interface MinimalisteTemplateProps {
  data: Partial<CVData>;
}

const MinimalisteTemplate: React.FC<MinimalisteTemplateProps> = ({ data }) => {
  const { personalInfo, education = [], experience = [], skills = [], languages = [] } = data;

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}.${year}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
      <div className="p-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-2">
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-4">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo?.city || personalInfo?.country) && (
              <span>
                {personalInfo?.city}{personalInfo?.city && personalInfo?.country && ', '}{personalInfo?.country}
              </span>
            )}
          </div>
          
          <div className="w-full h-px bg-gray-200 mt-6"></div>
        </header>

        {/* Summary */}
        {personalInfo?.summary && (
          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed text-lg font-light">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && experience.some(exp => exp.title && exp.company) && (
          <section className="mb-12">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
              Expérience
            </h2>
            <div className="space-y-8">
              {experience.filter(exp => exp.title && exp.company).map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-light text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-500 font-mono">
                      {formatDate(exp.startDate)}—{exp.current ? 'present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{exp.company}</p>
                  {exp.location && (
                    <p className="text-sm text-gray-500 mb-3">{exp.location}</p>
                  )}
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
          <section className="mb-12">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
              Formation
            </h2>
            <div className="space-y-6">
              {education.filter(edu => edu.degree && edu.institution).map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-light text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-500 font-mono">
                      {formatDate(edu.startDate)}—{formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{edu.institution}</p>
                  {edu.location && (
                    <p className="text-sm text-gray-500 mb-2">{edu.location}</p>
                  )}
                  {edu.description && (
                    <p className="text-gray-700 text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Skills */}
          {skills.length > 0 && skills.some(skill => skill.name) && (
            <section>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.filter(skill => skill.name).map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center">
                    <span className="text-gray-800">{skill.name}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && languages.some(lang => lang.name) && (
            <section>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
                Langues
              </h2>
              <div className="space-y-2">
                {languages.filter(lang => lang.name).map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-gray-800">{lang.name}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {lang.level}
                    </span>
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

export default MinimalisteTemplate;