// PDFDataContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { buildHTML } from '@/data/htmlContent'; // ou './htmlContent', ajuste conforme a estrutura do seu projeto

export interface ResponseEntry {
  questionId: string;
  questionText: string;
  answer: any;
}

export interface ConsentPDFData {
  id?: string;
  header: {
    date: string;
    time: string;
    ip: string;
    mask?: string;
    mac?: string;
    formatted: string;
  };
  cpf: string;
  rg: string;
  birthDate: string;
  responses: ResponseEntry[]; // Use a interface ResponseEntry aqui
  signature: string;
  questionnaireId: string;
  radiologyTechnician?: any;
  nursingTechnician?: any;
}

export interface PDFData {
  technician?: any;
  responses?: ResponseEntry[];
  header?: any;
  consent?: any;
  questionnaireId?: string;
  id?: string;
  radiologyTechnician?: any;
  nursingTechnician?: any;
}

export interface PDFDataContextProps {
  pdfData: PDFData;
  setPDFData: React.Dispatch<React.SetStateAction<PDFData>>;
  resetPDFData: () => void;
  generatePDF: (data: ConsentPDFData) => Promise<string>;
  savedForms: ConsentPDFData[];
  saveForm: (form: ConsentPDFData) => Promise<void>;
  updateForm: (form: ConsentPDFData) => Promise<void>;
  deleteForm: (id: string) => Promise<void>;
  getFormById: (id: string) => ConsentPDFData | undefined;
  getAllForms: () => ConsentPDFData[];
}

export const PDFDataContext = createContext<PDFDataContextProps | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

export const PDFDataProvider = ({ children }: ProviderProps) => {
  const [pdfData, setPDFData] = useState<PDFData>({});
  const [savedForms, setSavedForms] = useState<ConsentPDFData[]>([]);

  const filePath = FileSystem.documentDirectory + 'savedForms.json';

  // Função para resetar os dados do PDF
  const resetPDFData = () => {
    setPDFData({});
  };

  useEffect(() => {
    // Carrega os formulários salvos
    const loadSavedForms = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(filePath);
          const forms = JSON.parse(content) as ConsentPDFData[];
          setSavedForms(forms);
        } else {
          await FileSystem.writeAsStringAsync(filePath, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Erro ao carregar formulários salvos:', error);
      }
    };
    loadSavedForms();
  }, []);

  // Função para salvar um novo formulário
  const saveForm = async (form: ConsentPDFData) => {
    try {
      if (form.id) {
        console.error(
          'Formulário já possui um ID. Utilize updateForm para atualizar.'
        );
        return;
      }
      const newForm = { ...form, id: Date.now().toString() };
      const updatedForms = [...savedForms, newForm];
      updatedForms.sort(
        (a, b) =>
          new Date(b.header.date).getTime() - new Date(a.header.date).getTime()
      );
      setSavedForms(updatedForms);
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(updatedForms)
      );
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
    }
  };

  // Função para atualizar um formulário existente
  const updateForm = async (form: ConsentPDFData) => {
    try {
      if (!form.id) {
        console.error(
          'Formulário precisa ter um ID para ser atualizado. Utilize saveForm para criar um novo.'
        );
        return;
      }
      const updatedForms = savedForms.map((f) => (f.id === form.id ? form : f));
      updatedForms.sort(
        (a, b) =>
          new Date(b.header.date).getTime() - new Date(a.header.date).getTime()
      );
      setSavedForms(updatedForms);
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(updatedForms)
      );
    } catch (error) {
      console.error('Erro ao atualizar formulário:', error);
    }
  };

  // Função para deletar um formulário
  const deleteForm = async (id: string) => {
    try {
      const updatedForms = savedForms.filter((form) => form.id !== id);
      setSavedForms(updatedForms);
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(updatedForms)
      );
    } catch (error) {
      console.error('Erro ao deletar formulário:', error);
    }
  };

  // Função para buscar um formulário pelo ID
  const getFormById = (id: string): ConsentPDFData | undefined => {
    return savedForms.find((form) => form.id === id);
  };

  // Função para obter todos os formulários
  const getAllForms = (): ConsentPDFData[] => {
    return savedForms;
  };

  // Função para gerar o PDF *dentro* do contexto.  Importante!
  const generatePDF = async (data: ConsentPDFData): Promise<string> => {
    const html = await buildHTML(data); // Aguarda a resolução da promise
    try {
      const { uri } = await Print.printToFileAsync({ html });
      return uri;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  const contextValue: PDFDataContextProps = {
    pdfData,
    setPDFData,
    resetPDFData,
    generatePDF, // Inclua a função generatePDF aqui
    savedForms,
    saveForm,
    updateForm,
    deleteForm,
    getFormById,
    getAllForms,
  };

  return (
    <PDFDataContext.Provider value={contextValue}>
      {children}
    </PDFDataContext.Provider>
  );
};
