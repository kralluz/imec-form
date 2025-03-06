import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getDeviceInfo } from '../../utils/deviceInfo';
import Header from '../../components/Header';
import ConsentForm from '../../components/ConsentForm';
import { PDFDataContext, ConsentPDFData } from '../context/PDFDataContext';
import * as FileSystem from 'expo-file-system';
import { generatePDF } from '@/utils/generatePdf';
import SignatureModal from '@/components/SignatureModal';
import * as MediaLibrary from 'expo-media-library';

interface HeaderInfo {
  date: string;
  time: string;
  ip: string;
  mask?: string;
  mac?: string;
  formatted?: string;
}

export default function ConsentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    date: '',
    time: '',
    ip: '',
  });
  const [isSignatureModalVisible, setIsSignatureModalVisible] =
    useState<boolean>(false);
  const [signature, setSignature] = useState<string>('');

  const { pdfData, setPDFData, saveForm, updateForm } =
    useContext(PDFDataContext)!;

  useEffect(() => {
    async function requestMediaLibraryPermissions() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'A permissão para acessar a biblioteca de mídia é necessária.'
        );
      }
    }
    requestMediaLibraryPermissions();
  });

  useEffect(() => {
    if (pdfData.consent?.signature && pdfData.consent.signature !== signature) {
      setSignature(pdfData.consent.signature);
    }
  }, [pdfData.consent?.signature]);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setHeaderInfo(info);
    };
    fetchDeviceInfo();
  }, []);

  const handleSignature = (sig: string) => {
    setSignature(sig);
    setIsSignatureModalVisible(false);
  };

  const handleFormSubmit = async (data: any) => {
    if (!signature) {
      Alert.alert('Erro', 'Por favor, assine o documento.');
      return;
    }

    try {
      // 1.  Salvar a assinatura como JPEG.  Isso é importante!
      let cleanedSignature = signature;
      if (signature.startsWith('data:image')) {
        const parts = signature.split(',');
        if (parts.length > 1) {
          cleanedSignature = parts[1];
        }
      }

      const signaturePath =
        FileSystem.documentDirectory + `signature_${Date.now()}.jpg`; // .jpg!
      await FileSystem.writeAsStringAsync(signaturePath, cleanedSignature, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const now = new Date();
      const formattedDate = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedPdfData = {
        ...pdfData,
        header: {
          ...pdfData.header,
          ...headerInfo,
          formatted: `${formattedDate} às ${formattedTime}`,
        },
        consent: { ...data, signature: signaturePath }, // Salva o *caminho*
      };
      setPDFData(updatedPdfData);

      const completePDFData: ConsentPDFData = {
        ...updatedPdfData,
        header: {
          ...headerInfo,
          formatted: `${formattedDate} às ${formattedTime}`,
          date: headerInfo.date,
          time: headerInfo.time,
          ip: headerInfo.ip,
          mask: headerInfo.mask,
          mac: headerInfo.mac,
        },
        responses: updatedPdfData.responses!,
        cpf: data.cpf || '',
        rg: data.rg || '',
        birthDate: data.birthDate || '',
        signature: signaturePath, // Caminho do arquivo!
        questionnaireId: updatedPdfData.questionnaireId || id,
      };

      if (pdfData.id) {
        await updateForm(completePDFData);
      } else {
        await saveForm(completePDFData);
      }

      // 2. Gerar o PDF *depois* de salvar a assinatura.
      const pdfPath = await generatePDF(completePDFData); // Passa os dados completos
      const destinationPath =
        FileSystem.documentDirectory + 'document' + Date.now() + '.pdf';
      const fileInfo = await FileSystem.getInfoAsync(destinationPath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(destinationPath, { idempotent: true });
      }
      await FileSystem.moveAsync({
        from: pdfPath,
        to: destinationPath,
      });

      router.push('/success');
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerInfo={headerInfo} />
      <ScrollView style={styles.scrollView}>
        <ConsentForm
          onSubmit={handleFormSubmit}
          openSignature={() => setIsSignatureModalVisible(true)}
          signature={signature}
          existingConsent={pdfData.consent}
        />
        <SignatureModal
          visible={isSignatureModalVisible}
          onOK={handleSignature}
          onCancel={() => setIsSignatureModalVisible(false)}
        />
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
