import React, { createContext, useState, ReactNode, useEffect } from 'react';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { ConsentPDFData, generatePDF } from '@/utils/generatePdf';

export async function generatePDFs(data: any): Promise<string> {
  const html = await generatePDF(data);
  try {
    const { uri } = await Print.printToFileAsync({ html });

    return uri;
  } catch (error) {
    console.error('[generatePDF] Erro ao gerar PDF:', error);
    throw error;
  }
}

export interface PDFData {
  technician?: any;
  responses?: Record<string, any>;
  header?: any;
  consent?: any;
  questionnaireId?: string;
}

interface PDFDataContextProps {
  pdfData: PDFData;
  setPDFData: React.Dispatch<React.SetStateAction<PDFData>>;
  generatePDFs: (data: ConsentPDFData) => Promise<string>;
  savedForms: ConsentPDFData[];
  addOrUpdateForm: (form: ConsentPDFData) => Promise<void>;
  deleteForm: (id: string) => Promise<void>;
}

export const PDFDataContext = createContext<PDFDataContextProps | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

const FORMS_FILE = FileSystem.documentDirectory + 'forms.json';



export const PDFDataProvider = ({ children }: ProviderProps) => {
  const [pdfData, setPDFData] = useState<PDFData>({});
  const [savedForms, setSavedForms] = useState<ConsentPDFData[]>([]);

  // Carrega os formulários salvos do arquivo JSON
  useEffect(() => {
    const loadSavedForms = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(FORMS_FILE);
        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(FORMS_FILE);
          const forms = JSON.parse(content) as ConsentPDFData[];
          setSavedForms(forms);
        }
      } catch (error) {
        console.error('Erro ao carregar formulários salvos:', error);
      }
    };
    loadSavedForms();
  }, []);

  // Adiciona ou atualiza um formulário e persiste no arquivo JSON
  const addOrUpdateForm = async (form: ConsentPDFData) => {
    try {
      const generateUniqueId = (): string => {
        return (
          Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        );
      };

      const formWithId = { ...form, id: form.id || generateUniqueId() };
      const updatedForms = savedForms.filter((f) => f.id !== formWithId.id);
      updatedForms.push(formWithId);
      updatedForms.sort(
        (a, b) =>
          new Date(b.header.date).getTime() - new Date(a.header.date).getTime()
      );
      setSavedForms(updatedForms);
      await FileSystem.writeAsStringAsync(
        FORMS_FILE,
        JSON.stringify(updatedForms)
      );
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
    }
  };

  // Remove um formulário e atualiza o arquivo JSON
  const deleteForm = async (id: string) => {
    try {
      const updatedForms = savedForms.filter((form) => form.id !== id);
      setSavedForms(updatedForms);
      await FileSystem.writeAsStringAsync(
        FORMS_FILE,
        JSON.stringify(updatedForms)
      );
    } catch (error) {
      console.error('Erro ao deletar formulário:', error);
    }
  };

  const contextValue = {
    pdfData,
    setPDFData,
    generatePDFs,
    savedForms,
    addOrUpdateForm,
    deleteForm,
  };

  return (
    <PDFDataContext.Provider value={contextValue}>
      {children}
    </PDFDataContext.Provider>
  );
};
