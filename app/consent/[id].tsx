// app/consent/[id].tsx
import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getDeviceInfo } from '../../utils/deviceInfo';
import Header from '../../components/Header';

import ConsentForm, { ConsentFormData } from '../../components/ConsentForm';
import { PDFDataContext } from '../context/PDFDataContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { generatePDF } from '@/utils/generatePdf';

export default function ConsentScreen() {
  const { id } = useLocalSearchParams<{ id: any }>();
  const [headerInfo, setHeaderInfo] = useState<any>({
    date: '',
    time: '',
    ip: '',
  });

  const { pdfData, setPDFData } = useContext(PDFDataContext)!;

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setHeaderInfo(info);
    };
    fetchDeviceInfo();
  }, []);

  const handleFormSubmit = async (data: any) => {
    try {
      const formattedDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Atualiza o contexto com os dados de consentimento e header
      setPDFData((prev) => ({
        ...prev,
        header: {
          ...prev.header,
          ...headerInfo,
          formatted: `${formattedDate} às ${formattedTime}`,
        },
        consent: data,
      }));

      // Monta os dados completos para o PDF
      const completePDFData: any = {
        header: {
          ...headerInfo,
          formatted: `${formattedDate} às ${formattedTime}`,
        },
        responses: pdfData.responses,
        cpf: data.cpf || '',
        rg: data.rg || '',
        birthDate: data.birthDate || '',
        signature: data.signature || '',
      };

      // Gera o PDF
      const pdfPath = await generatePDF(completePDFData);
      const destinationPath = FileSystem.documentDirectory + 'document.pdf';
      const fileInfo = await FileSystem.getInfoAsync(destinationPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(destinationPath, { idempotent: true });
      }
      await FileSystem.moveAsync({
        from: pdfPath,
        to: destinationPath,
      });

      // Verifica se o compartilhamento está disponível e compartilha o PDF
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Compartilhamento não disponível',
          'Este dispositivo não suporta compartilhamento de arquivos.'
        );
        return;
      }
      await Sharing.shareAsync(destinationPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar PDF',
      });

      // Navega para a tela de sucesso
      router.push('/success');
    } catch (error) {
      console.error('Erro ao gerar ou compartilhar o PDF:', error);
      Alert.alert('Erro', 'Não foi possível gerar ou compartilhar o PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerInfo={headerInfo} />
      <ScrollView style={styles.scrollView}>
        <ConsentForm onSubmit={handleFormSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
});
