export type QuestionnaireType =
  | 'tomografia'
  | 'mamografia'
  | 'ressonancia'
  | 'coronarias';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox';
  options?: QuestionOption[];
  conditionalQuestions?: {
    value: string;
    questions: Question[];
  }[];
}

export interface Questionnaire {
  id: QuestionnaireType;
  title: string;
  icon: string;
  questions: Question[];
}

export interface HeaderInfo {
  date: string;
  time: string;
  ip: string;
 }

export interface UserInfo {
  cpf: string;
  rg: string;
  birthDate: string;
  signature: string;
}

export interface FormData {
  [key: string]: string | boolean | string[];
}
