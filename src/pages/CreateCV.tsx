import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import ProgressBar from '../components/cv-creator/ProgressBar';
import PersonalInfoStep from '../components/cv-creator/PersonalInfoStep';
import EducationStep from '../components/cv-creator/EducationStep';
import ExperienceStep from '../components/cv-creator/ExperienceStep';
import SkillsStep from '../components/cv-creator/SkillsStep';
import { PersonalInfo, Education, Experience, Skill, Language } from '../types/cv';
import { saveCVData, getCVData, generateId } from '../utils/storage';
import { Router } from '../utils/router';

const CreateCV: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Niger',
    summary: ''
  });
  
  const [education, setEducation] = useState<Education[]>([{
    id: generateId(),
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  }]);
  
  const [experience, setExperience] = useState<Experience[]>([{
    id: generateId(),
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);
  
  const [skills, setSkills] = useState<Skill[]>([{
    id: generateId(),
    name: '',
    level: 'Intermédiaire'
  }]);
  
  const [languages, setLanguages] = useState<Language[]>([{
    id: generateId(),
    name: 'Français',
    level: 'Natif'
  }]);

  const router = Router.getInstance();
  const stepNames = ['Informations', 'Formation', 'Expérience', 'Compétences'];
  const totalSteps = 4;

  // Load saved data on mount
  useEffect(() => {
    const savedData = getCVData();
    if (savedData.personalInfo) setPersonalInfo(savedData.personalInfo);
    if (savedData.education && savedData.education.length > 0) setEducation(savedData.education);
    if (savedData.experience && savedData.experience.length > 0) setExperience(savedData.experience);
    if (savedData.skills && savedData.skills.length > 0) setSkills(savedData.skills);
    if (savedData.languages && savedData.languages.length > 0) setLanguages(savedData.languages);
  }, []);

  // Auto-save data when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCVData({
        personalInfo,
        education,
        experience,
        skills,
        languages
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [personalInfo, education, experience, skills, languages]);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.phone && personalInfo.city);
      case 2:
        return education.some(edu => edu.degree && edu.institution);
      case 3:
        return experience.some(exp => exp.title && exp.company);
      case 4:
        return skills.some(skill => skill.name) && languages.some(lang => lang.name);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (validateCurrentStep()) {
      saveCVData({
        personalInfo,
        education,
        experience,
        skills,
        languages
      });
      router.navigate('templates');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={personalInfo} onChange={setPersonalInfo} />;
      case 2:
        return <EducationStep data={education} onChange={setEducation} />;
      case 3:
        return <ExperienceStep data={experience} onChange={setExperience} />;
      case 4:
        return <SkillsStep 
          skills={skills}
          languages={languages}
          onSkillsChange={setSkills}
          onLanguagesChange={setLanguages}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Créer votre{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              CV professionnel
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Suivez ces étapes simples pour créer un CV qui vous démarque
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepNames={stepNames}
        />

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Précédent
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                saveCVData({ personalInfo, education, experience, skills, languages });
                alert('Données sauvegardées !');
              }}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200"
            >
              <Save className="h-5 w-5 mr-2" />
              Sauvegarder
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Suivant
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!validateCurrentStep()}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Choisir un template
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCV;