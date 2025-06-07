// CV Extractor utility for parsing external CV files
export interface ExtractedCVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  // Simulate PDF text extraction
  // In a real implementation, you would use a library like pdf-parse or PDF.js
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock extracted text - in reality this would come from the PDF
      const mockText = `
        John Doe
        john.doe@email.com
        +227 20 12 34 56
        Niamey, Niger
        
        EXPÉRIENCE PROFESSIONNELLE
        
        Développeur Web Senior - Tech Solutions Niger
        Janvier 2022 - Présent
        • Développement d'applications web avec React et Node.js
        • Gestion d'équipe de 3 développeurs
        • Amélioration des performances des applications existantes
        
        Développeur Junior - Digital Niger
        Mars 2020 - Décembre 2021
        • Création de sites web responsives
        • Maintenance et debugging d'applications
        
        FORMATION
        
        Licence en Informatique - Université Abdou Moumouni
        2017 - 2020
        Spécialisation en développement web et bases de données
        
        COMPÉTENCES
        • JavaScript (Avancé)
        • React (Avancé)
        • Node.js (Intermédiaire)
        • Python (Intermédiaire)
        
        LANGUES
        • Français (Natif)
        • Anglais (Avancé)
        • Haoussa (Intermédiaire)
      `;
      resolve(mockText);
    }, 1500); // Simulate processing time
  });
};

export const extractTextFromWord = async (file: File): Promise<string> => {
  // Simulate Word document text extraction
  // In a real implementation, you would use a library like mammoth.js
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockText = `
        Marie Abdou
        marie.abdou@email.com
        +227 20 98 76 54
        Niamey, Niger
        
        Profil professionnel motivé avec 3 ans d'expérience en marketing digital
        
        EXPÉRIENCE PROFESSIONNELLE
        
        Marketing Manager - StartupNiger
        Juin 2021 - Présent
        • Gestion des campagnes publicitaires digitales
        • Augmentation du trafic web de 150%
        • Management d'une équipe de 2 personnes
        
        Assistant Marketing - Commerce Plus
        Septembre 2020 - Mai 2021
        • Création de contenu pour les réseaux sociaux
        • Analyse des performances marketing
        
        FORMATION
        
        Master en Marketing - Institut Supérieur de Commerce
        2018 - 2020
        Mention Bien
        
        COMPÉTENCES
        • Google Ads (Expert)
        • Facebook Ads (Avancé)
        • Analytics (Avancé)
        • Photoshop (Intermédiaire)
        
        LANGUES
        • Français (Natif)
        • Anglais (Avancé)
      `;
      resolve(mockText);
    }, 1500);
  });
};

export const parseExtractedText = (text: string): ExtractedCVData => {
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  // Simple parsing logic - in reality this would be much more sophisticated
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const result: ExtractedCVData = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Niger',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: []
  };

  let currentSection = '';
  let currentExperience: any = null;
  let currentEducation: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract name (usually first line)
    if (i === 0 && !result.personalInfo.firstName) {
      const nameParts = line.split(' ');
      if (nameParts.length >= 2) {
        result.personalInfo.firstName = nameParts[0];
        result.personalInfo.lastName = nameParts.slice(1).join(' ');
      }
    }
    
    // Extract email
    if (line.includes('@') && !result.personalInfo.email) {
      const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) {
        result.personalInfo.email = emailMatch[1];
      }
    }
    
    // Extract phone
    if (line.match(/\+227|(\d{2}\s){4}/) && !result.personalInfo.phone) {
      result.personalInfo.phone = line.trim();
    }
    
    // Extract city and country
    if (line.includes('Niger') && !result.personalInfo.city) {
      const parts = line.split(',');
      if (parts.length >= 2) {
        result.personalInfo.city = parts[0].trim();
        result.personalInfo.country = parts[1].trim();
      }
    }
    
    // Detect sections
    if (line.toUpperCase().includes('EXPÉRIENCE') || line.toUpperCase().includes('EXPERIENCE')) {
      currentSection = 'experience';
      continue;
    }
    
    if (line.toUpperCase().includes('FORMATION') || line.toUpperCase().includes('ÉDUCATION')) {
      currentSection = 'education';
      continue;
    }
    
    if (line.toUpperCase().includes('COMPÉTENCES') || line.toUpperCase().includes('COMPETENCES')) {
      currentSection = 'skills';
      continue;
    }
    
    if (line.toUpperCase().includes('LANGUES')) {
      currentSection = 'languages';
      continue;
    }
    
    // Parse experience
    if (currentSection === 'experience') {
      if (line.includes(' - ') && !line.startsWith('•')) {
        // Save previous experience
        if (currentExperience) {
          result.experience.push(currentExperience);
        }
        
        const parts = line.split(' - ');
        currentExperience = {
          id: generateId(),
          title: parts[0].trim(),
          company: parts[1].trim(),
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        };
      } else if (line.match(/\d{4}/) && currentExperience) {
        // Date line
        const dateMatch = line.match(/(\w+\s+\d{4})\s*-\s*(\w+\s+\d{4}|Présent)/);
        if (dateMatch) {
          currentExperience.startDate = dateMatch[1];
          currentExperience.endDate = dateMatch[2];
          currentExperience.current = dateMatch[2].toLowerCase().includes('présent');
        }
      } else if (line.startsWith('•') && currentExperience) {
        // Description bullet point
        currentExperience.description += (currentExperience.description ? '\n' : '') + line;
      }
    }
    
    // Parse education
    if (currentSection === 'education') {
      if (line.includes(' - ') && !line.startsWith('•')) {
        if (currentEducation) {
          result.education.push(currentEducation);
        }
        
        const parts = line.split(' - ');
        currentEducation = {
          id: generateId(),
          degree: parts[0].trim(),
          institution: parts[1].trim(),
          location: '',
          startDate: '',
          endDate: '',
          description: ''
        };
      } else if (line.match(/\d{4}/) && currentEducation) {
        const dateMatch = line.match(/(\d{4})\s*-\s*(\d{4})/);
        if (dateMatch) {
          currentEducation.startDate = dateMatch[1];
          currentEducation.endDate = dateMatch[2];
        }
      } else if (currentEducation && !line.match(/\d{4}/)) {
        currentEducation.description += (currentEducation.description ? ' ' : '') + line;
      }
    }
    
    // Parse skills
    if (currentSection === 'skills') {
      if (line.startsWith('•') || line.includes('(')) {
        const skillMatch = line.match(/•?\s*(.+?)\s*\((.+?)\)/);
        if (skillMatch) {
          result.skills.push({
            id: generateId(),
            name: skillMatch[1].trim(),
            level: skillMatch[2].trim()
          });
        } else {
          const skillName = line.replace('•', '').trim();
          if (skillName) {
            result.skills.push({
              id: generateId(),
              name: skillName,
              level: 'Intermédiaire'
            });
          }
        }
      }
    }
    
    // Parse languages
    if (currentSection === 'languages') {
      if (line.startsWith('•') || line.includes('(')) {
        const langMatch = line.match(/•?\s*(.+?)\s*\((.+?)\)/);
        if (langMatch) {
          result.languages.push({
            id: generateId(),
            name: langMatch[1].trim(),
            level: langMatch[2].trim()
          });
        }
      }
    }
  }
  
  // Add remaining items
  if (currentExperience) {
    result.experience.push(currentExperience);
  }
  if (currentEducation) {
    result.education.push(currentEducation);
  }
  
  // Extract summary from the beginning
  const summaryLines = lines.slice(0, 10).filter(line => 
    !line.includes('@') && 
    !line.match(/\+227/) && 
    !line.includes('Niger') &&
    !line.includes(result.personalInfo.firstName) &&
    line.length > 20
  );
  
  if (summaryLines.length > 0) {
    result.personalInfo.summary = summaryLines[0];
  }
  
  return result;
};

export const extractDataFromFile = async (file: File): Promise<ExtractedCVData> => {
  let extractedText = '';
  
  if (file.type === 'application/pdf') {
    extractedText = await extractTextFromPDF(file);
  } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
    extractedText = await extractTextFromWord(file);
  } else {
    throw new Error('Format de fichier non supporté. Utilisez PDF ou Word.');
  }
  
  return parseExtractedText(extractedText);
};