import { LetterGenerationRequest, LetterData } from '../types/letter';
import { generateId } from './storage';

// Mock AI letter generation based on CV data
export const generateCoverLetter = (request: LetterGenerationRequest): string => {
  console.log('Generating cover letter with request:', request);
  
  const { cvData, jobTitle, companyName, jobDescription, sector, applicationType } = request;
  const { personalInfo, experience, education, skills } = cvData;

  if (!personalInfo) {
    throw new Error('Données CV manquantes: informations personnelles');
  }

  // Extract relevant skills based on job description
  const relevantSkills = extractRelevantSkills(skills || [], jobDescription);
  
  // Get most recent experience
  const recentExperience = experience?.length > 0 ? experience[0] : null;
  
  // Get highest education
  const mainEducation = education?.length > 0 ? education[0] : null;

  // Generate personalized letter content
  const letterContent = `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}
${personalInfo?.address || ''}
${personalInfo?.city || ''}, ${personalInfo?.country || 'Niger'}
${personalInfo?.email || ''}
${personalInfo?.phone || ''}

${companyName}
${new Date().toLocaleDateString('fr-FR')}

Objet : ${getLetterSubject(applicationType, jobTitle)}

Madame, Monsieur,

${generateOpeningParagraph(applicationType, jobTitle, companyName)}

${generateExperienceParagraph(recentExperience, relevantSkills, jobTitle)}

${generateEducationParagraph(mainEducation, sector)}

${generateSkillsParagraph(relevantSkills, jobDescription)}

${generateClosingParagraph(applicationType, companyName)}

${generateSignature(personalInfo)}`;

  console.log('Generated letter content:', letterContent);
  return letterContent;
};

const extractRelevantSkills = (skills: any[], jobDescription: string): any[] => {
  if (!skills || !jobDescription) return [];
  
  const jobKeywords = jobDescription.toLowerCase().split(/\s+/);
  return skills.filter(skill => {
    if (!skill.name) return false;
    const skillWords = skill.name.toLowerCase().split(/\s+/);
    return skillWords.some(word => jobKeywords.includes(word));
  });
};

const getLetterSubject = (type: string, jobTitle: string): string => {
  switch (type) {
    case 'offre':
      return `Candidature pour le poste de ${jobTitle}`;
    case 'spontanee':
      return `Candidature spontanée - ${jobTitle}`;
    case 'stage':
      return `Demande de stage - ${jobTitle}`;
    default:
      return `Candidature - ${jobTitle}`;
  }
};

const generateOpeningParagraph = (type: string, jobTitle: string, companyName: string): string => {
  switch (type) {
    case 'offre':
      return `J'ai l'honneur de vous adresser ma candidature pour le poste de ${jobTitle} au sein de ${companyName}. Votre annonce a particulièrement retenu mon attention car elle correspond parfaitement à mon profil professionnel et à mes aspirations de carrière.`;
    case 'spontanee':
      return `Passionné(e) par le secteur d'activité de ${companyName}, je me permets de vous adresser ma candidature spontanée pour un poste de ${jobTitle}. Votre entreprise jouit d'une excellente réputation et j'aimerais contribuer à son développement.`;
    case 'stage':
      return `Actuellement en formation, je sollicite un stage de ${jobTitle} au sein de ${companyName}. Cette opportunité représenterait pour moi l'occasion idéale d'appliquer mes connaissances théoriques dans un contexte professionnel stimulant.`;
    default:
      return `Je vous écris pour exprimer mon intérêt pour le poste de ${jobTitle} au sein de ${companyName}.`;
  }
};

const generateExperienceParagraph = (experience: any, relevantSkills: any[], jobTitle: string): string => {
  if (!experience || !experience.title) {
    return `Bien que débutant(e) dans ce domaine, je possède une forte motivation et une capacité d'apprentissage rapide qui me permettront de m'adapter efficacement aux exigences du poste de ${jobTitle}.`;
  }

  const skillsText = relevantSkills.length > 0 
    ? ` J'ai notamment développé des compétences en ${relevantSkills.map(s => s.name).join(', ')}.`
    : '';

  const description = experience.description || '';
  const truncatedDesc = description.length > 200 ? description.slice(0, 200) + '...' : description;

  return `Fort(e) de mon expérience en tant que ${experience.title} chez ${experience.company || 'une entreprise du secteur'}, j'ai acquis une solide expertise qui me permettra de réussir dans le poste de ${jobTitle}.${skillsText} ${truncatedDesc}`;
};

const generateEducationParagraph = (education: any, sector: string): string => {
  if (!education || !education.degree) {
    return `Ma formation autodidacte et mon expérience pratique m'ont permis d'acquérir les compétences nécessaires pour évoluer dans le secteur ${sector}.`;
  }

  const institution = education.institution || 'un établissement reconnu';
  const description = education.description || '';
  const truncatedDesc = description.length > 150 ? description.slice(0, 150) + '...' : description;

  return `Ma formation en ${education.degree} obtenue à ${institution} m'a donné les bases théoriques solides nécessaires pour exceller dans ce domaine. ${truncatedDesc}`;
};

const generateSkillsParagraph = (relevantSkills: any[], jobDescription: string): string => {
  if (relevantSkills.length === 0) {
    return `Je suis convaincu(e) que ma polyvalence, ma capacité d'adaptation et mon enthousiasme seront des atouts précieux pour votre équipe.`;
  }

  return `Mes compétences en ${relevantSkills.map(s => s.name).join(', ')} correspondent parfaitement aux exigences mentionnées dans votre offre. Je suis confiant(e) de pouvoir apporter une valeur ajoutée significative à votre équipe.`;
};

const generateClosingParagraph = (type: string, companyName: string): string => {
  const closing = type === 'stage' 
    ? 'Je serais ravi(e) de discuter de cette opportunité de stage lors d\'un entretien.'
    : 'Je serais honoré(e) de contribuer au succès de votre entreprise et de développer ma carrière au sein de votre équipe.';

  return `${closing} Je reste à votre disposition pour tout complément d'information et espère avoir l'opportunité de vous rencontrer prochainement.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`;
};

const generateSignature = (personalInfo: any): string => {
  return `${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`;
};

export const saveLetter = (letterData: LetterData): void => {
  try {
    console.log('Saving letter:', letterData);
    const letters = getStoredLetters();
    const updatedLetters = letters.filter(letter => letter.id !== letterData.id);
    updatedLetters.push(letterData);
    localStorage.setItem('boltcv-letters', JSON.stringify(updatedLetters));
    console.log('Letter saved successfully');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la lettre:', error);
    throw error;
  }
};

export const getStoredLetters = (): LetterData[] => {
  try {
    const letters = localStorage.getItem('boltcv-letters');
    return letters ? JSON.parse(letters) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des lettres:', error);
    return [];
  }
};

export const getLetterById = (id: string): LetterData | null => {
  const letters = getStoredLetters();
  return letters.find(letter => letter.id === id) || null;
};

export const deleteLetterById = (id: string): void => {
  try {
    const letters = getStoredLetters();
    const updatedLetters = letters.filter(letter => letter.id !== id);
    localStorage.setItem('boltcv-letters', JSON.stringify(updatedLetters));
  } catch (error) {
    console.error('Erreur lors de la suppression de la lettre:', error);
  }
};

export const createLetterFromCV = (cvData: any, generationData: Omit<LetterGenerationRequest, 'cvData'>): LetterData => {
  console.log('Creating letter from CV:', { cvData, generationData });
  
  if (!cvData) {
    throw new Error('Données CV manquantes');
  }

  if (!generationData.jobTitle || !generationData.companyName || !generationData.jobDescription || !generationData.sector) {
    throw new Error('Données de génération incomplètes');
  }

  const request: LetterGenerationRequest = {
    cvData,
    ...generationData
  };

  const content = generateCoverLetter(request);
  
  const letterData: LetterData = {
    id: generateId(),
    cvId: cvData.id || generateId(),
    jobTitle: generationData.jobTitle,
    companyName: generationData.companyName,
    jobDescription: generationData.jobDescription,
    sector: generationData.sector,
    applicationType: generationData.applicationType,
    content,
    generatedAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };

  console.log('Letter created successfully:', letterData);
  return letterData;
};