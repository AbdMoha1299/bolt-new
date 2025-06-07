export interface LetterData {
  id: string;
  cvId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  sector: string;
  applicationType: 'offre' | 'spontanee' | 'stage';
  content: string;
  generatedAt: string;
  lastModified: string;
}

export interface LetterGenerationRequest {
  cvData: any;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  sector: string;
  applicationType: 'offre' | 'spontanee' | 'stage';
}

export interface SavedDocument {
  type: 'cv' | 'letter';
  id: string;
  name: string;
  lastModified: string;
  cvId?: string;
  linkedDocuments?: SavedDocument[];
}