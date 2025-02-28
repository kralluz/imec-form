import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getDeviceInfo } from '../../utils/deviceInfo';
import { HeaderInfo, QuestionnaireType } from '../../types';
import Header from '../../components/Header';
import { generatePDF } from '@/utils/generatePdf';
import { PDFDataContext } from '@/context/PDFDataContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ConsentForm, { ConsentFormData } from '../../components/ConsentForm';

export default function ConsentScreen() {
  const { id } = useLocalSearchParams<{ id: QuestionnaireType }>();
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    date: '',
    time: '',
    ip: '',
  });

  const { pdfData } = useContext(PDFDataContext)!;

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setHeaderInfo(info);
    };
    fetchDeviceInfo();
  }, []);

  // Função para salvar o PDF no armazenamento local
  const savePDFToLocal = async (pdfPath: string): Promise<string> => {
    const destinationPath =
      FileSystem.documentDirectory + 'formulario_consentimento.pdf';
    try {
      const fileInfo = await FileSystem.getInfoAsync(destinationPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(destinationPath, { idempotent: true });
      }
      await FileSystem.moveAsync({
        from: pdfPath,
        to: destinationPath,
      });
      return destinationPath;
    } catch (error) {
      console.error('Erro ao salvar localmente:', error);
      throw error;
    }
  };

  const handleFormSubmit = async (data: ConsentFormData) => {
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
      const completePDFData = {
        header: {
          ...pdfData.header,
          ...headerInfo,
          formatted: `${formattedDate} às ${formattedTime}`,
        },
        responses: pdfData.responses || {},
        ...data,
      };

      const pdfPath = await generatePDF(completePDFData);
      const localPath = await savePDFToLocal(pdfPath);

      Alert.alert('PDF Gerado', `O PDF foi gerado em:\n${localPath}`, [
        {
          text: 'Compartilhar',
          onPress: async () => {
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
              Alert.alert(
                'Compartilhamento não disponível',
                'Este dispositivo não suporta compartilhamento de arquivos.'
              );
              return;
            }
            await Sharing.shareAsync(localPath, {
              mimeType: 'application/pdf',
              dialogTitle: 'Compartilhar PDF',
            });
            // router.push('/success');
          },
        },
        {
          text: 'Fechar',
          onPress: () => router.push('/success'),
          style: 'cancel',
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar ou salvar o PDF.');
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
