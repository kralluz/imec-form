import React, { createContext, useState, ReactNode, useEffect } from 'react';
import * as Print from 'expo-print';
import { buildHTML } from '@/data/htmlContent';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ConsentPDFData } from '@/utils/generatePdf';

export async function generatePDF(data: any): Promise<string> {
  console.log('[generatePDF] Iniciando a geração do PDF.');
  console.log('[generatePDF] Dados recebidos para PDF:', data);
  const html = buildHTML(data);
  console.log('[generatePDF] HTML gerado:', html);
  try {
    const { uri } = await Print.printToFileAsync({ html });
    console.log('[generatePDF] PDF gerado com sucesso no URI:', uri);
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
  generatePDF: (data: ConsentPDFData) => Promise<string>;
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

// Função que solicita permissão para escrita (usada sempre que for salvar)
const requestWritePermission = () => {
  return new Promise<void>((resolve, reject) => {
    Alert.alert(
      'Permissão',
      'Você permite salvar o arquivo?',
      [
        { text: 'Não', onPress: () => reject(new Error('Permissão negada')) },
        { text: 'Sim', onPress: () => resolve() },
      ],
      { cancelable: false }
    );
  });
};

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
      // Solicita permissão de escrita sempre que for salvar
      await requestWritePermission();

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
      await requestWritePermission();
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
    generatePDF,
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
