// app/context/PDFDataContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildHTML } from '@/data/htmlContent';

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
  responses: { [key: string]: any };
  signature: string;
}

export async function generatePDF(data: ConsentPDFData): Promise<string> {
  // Extrai nome do paciente e motivo para layout diferenciado
  const { pacienteNome, motivo, ...otherResponses } = data.responses;

  // Monta as demais respostas em uma única linha (separadas por ponto e vírgula)
  const otherResponsesHtml = Object.entries(otherResponses)
    .map(([key, value]) => `<span><strong>${key}:</strong> ${value}</span>`)
    .join('; ');

  // Monta a parte de respostas, destacando "motivo" em uma box
  const responsesHtml = `
    <div class="motivo-box">
      <strong>Motivo:</strong> ${motivo}
    </div>
    <div class="other-responses">
      ${otherResponsesHtml}
    </div>
  `;

  const html = buildHTML(data);

  try {
    const { uri } = await Print.printToFileAsync({ html: html });
    return uri;
  } catch (error) {
    console.log('🚀 ~ generatePDF ~ error:', error);
    console.error('Erro ao gerar PDF:', error);
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

export const PDFDataProvider = ({ children }: ProviderProps) => {
  const [pdfData, setPDFData] = useState<PDFData>({});
  const [savedForms, setSavedForms] = useState<ConsentPDFData[]>([]);

  useEffect(() => {
    // Carrega os formulários salvos ao montar o provider
    const loadSavedForms = async () => {
      try {
        const storedForms = await AsyncStorage.getItem('savedForms');
        if (storedForms) {
          const forms = JSON.parse(storedForms) as ConsentPDFData[];
          setSavedForms(forms);
        }
      } catch (error) {
        console.error('Erro ao carregar formulários salvos:', error);
      }
    };
    loadSavedForms();
  }, []);

  const addOrUpdateForm = async (form: ConsentPDFData) => {
    // Garante que o formulário tenha um ID (gera com Date.now() se não tiver)
    const formWithId = { ...form, id: form.id || Date.now().toString() };
    const updatedForms = savedForms.filter((f) => f.id !== formWithId.id);
    updatedForms.push(formWithId);
    // Ordena do mais recente para o mais antigo (assumindo que header.date esteja em formato compatível)
    updatedForms.sort(
      (a, b) =>
        new Date(b.header.date).getTime() - new Date(a.header.date).getTime()
    );
    setSavedForms(updatedForms);
    try {
      await AsyncStorage.setItem('savedForms', JSON.stringify(updatedForms));
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
    }
  };

  const deleteForm = async (id: string) => {
    const updatedForms = savedForms.filter((form) => form.id !== id);
    setSavedForms(updatedForms);
    try {
      await AsyncStorage.setItem('savedForms', JSON.stringify(updatedForms));
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
