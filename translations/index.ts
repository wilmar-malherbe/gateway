import { afr } from './afr';
import { eng } from './eng';
import { Language } from '@/contexts/LanguageContext';

export const translations = {
  afr,
  eng,
};

export function translate(language: Language) {
  return translations[language];
}
