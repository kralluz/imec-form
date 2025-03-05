// app/consent/[id].tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  SafeAreaView,
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getDeviceInfo } from '../../utils/deviceInfo';
import Header from '../../components/Header';
import ConsentForm from '../../components/ConsentForm'; // Atualizado
import { PDFDataContext } from '../context/PDFDataContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { generatePDF } from '@/utils/generatePdf';
import SignatureScreen from 'react-native-signature-canvas'; // Importe o componente de assinatura
import SignatureModal from '@/components/SignatureModal';

export default function ConsentScreen() {
  const { id } = useLocalSearchParams<{ id: any }>();
  const [headerInfo, setHeaderInfo] = useState<any>({
    date: '',
    time: '',
    ip: '',
  });
  const [isSignatureModalVisible, setIsSignatureModalVisible] = useState(false);
  const [signature, setSignature] = useState('');

  const { pdfData, setPDFData, addOrUpdateForm } = useContext(PDFDataContext)!;

  useEffect(() => {
    // Carrega a assinatura, se existir, do contexto.  Importante para edição.
    if (pdfData.consent?.signature) {
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
      const formattedDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Atualiza o contexto
      const updatedPdfData = {
        ...pdfData,
        header: {
          ...pdfData.header,
          ...headerInfo,
          formatted: `${formattedDate} às ${formattedTime}`,
        },
        consent: { ...data, signature },
      };
      setPDFData(updatedPdfData);

      // Monta os dados completos
      const completePDFData: any = {
        ...updatedPdfData,
        header: {
          ...headerInfo,
          formatted: `${formattedDate} às ${formattedTime}`,
        },
        responses: updatedPdfData.responses,
        cpf: data.cpf || '',
        rg: data.rg || '',
        birthDate: data.birthDate || '',
        signature: signature || '',
      };

      // Salva o formulário *antes* de gerar o PDF (importante para edição)
      await addOrUpdateForm(completePDFData);

       // Gera o PDF *após* salvar (para incluir a assinatura mais recente)
      const pdfPath = await generatePDF(completePDFData);
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

      // Navega para a tela de sucesso *antes* de compartilhar
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

        {/* Modal de Assinatura */}
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
