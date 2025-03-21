import React, { createContext, useContext, useState, ReactNode } from 'react';

const BASE_URL = 'http://172.16.108.152:3021';

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
}

interface QuestionnaireContextData {
  questionnaires: Questionnaire[];
  isLoading: boolean;
  error: string | null;
  getQuestionnaires: () => Promise<void>;
  createQuestionnaire: (data: Partial<Questionnaire>) => Promise<Questionnaire>;
  getQuestionnaireById: (id: string) => Promise<Questionnaire | null>;
}

const QuestionnaireContext = createContext<
  QuestionnaireContextData | undefined
>(undefined);

interface QuestionnaireProviderProps {
  children: ReactNode;
}

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({
  children,
}) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getQuestionnaires = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/questionnaires/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao carregar questionários');
      }

      const data: Questionnaire[] = await response.json();
      setQuestionnaires(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao carregar questionários:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createQuestionnaire = async (
    data: Partial<Questionnaire>,
  ): Promise<Questionnaire> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/questionnaires/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar questionário');
      }

      const newQuestionnaire: Questionnaire = await response.json();
      setQuestionnaires((prev) => [...prev, newQuestionnaire]);
      return newQuestionnaire;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao criar questionário:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionnaireById = async (
    id: string,
  ): Promise<Questionnaire | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/questionnaires/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar questionário');
      }

      const questionnaire: Questionnaire = await response.json();
      return questionnaire;
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao buscar questionário:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        questionnaires,
        isLoading,
        error,
        getQuestionnaires,
        createQuestionnaire,
        getQuestionnaireById,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = (): QuestionnaireContextData => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error(
      'useQuestionnaire must be used within a QuestionnaireProvider',
    );
  }
  return context;
};
