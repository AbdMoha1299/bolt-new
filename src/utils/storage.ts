import { CVData } from '../types/cv';

const CV_STORAGE_KEY = 'boltcv-data';

export const saveCVData = (data: Partial<CVData>): void => {
  try {
    const existingData = getCVData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

export const getCVData = (): Partial<CVData> => {
  try {
    const data = localStorage.getItem(CV_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return {};
  }
};

export const clearCVData = (): void => {
  try {
    localStorage.removeItem(CV_STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};