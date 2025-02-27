// app/consent/[id].tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getDeviceInfo } from '../../utils/deviceInfo';
import { HeaderInfo, QuestionnaireType } from '../../types';
import Header from '../../components/Header';
import ConsentForm from '../../components/ConsentForm';
import { generatePDF } from '@/utils/generatePdf';
import { PDFDataContext } from '@/context/PDFDataContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ConsentScreen() {
  const { id } = useLocalSearchParams<{ id: QuestionnaireType }>();
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    date: '',
    time: '',
    ip: '',
    mask: '',
    mac: '',
  });

  // Dados do consentimento
  const [signature, setSignature] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);

  const { pdfData } = useContext(PDFDataContext)!;

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setHeaderInfo(info);
    };

    fetchDeviceInfo();
  }, []);

  // Função para salvar o PDF em uma pasta local utilizando expo-file-system
  const savePDFToLocal = async (pdfPath: string): Promise<string> => {
    // Define o caminho de destino dentro do diretório de documentos do app
    const destinationPath =
      FileSystem.documentDirectory + 'formulario_consentimento.pdf';
    try {
      // Se já existir um arquivo com esse nome, deleta-o
      const fileInfo = await FileSystem.getInfoAsync(destinationPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(destinationPath, { idempotent: true });
      }
      // Move o arquivo gerado para o diretório de documentos
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

  const handleShare = async (localPath: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Compartilhamento não disponível',
          'O compartilhamento de arquivos não é suportado neste dispositivo.'
        );
        return;
      }
      await Sharing.shareAsync(localPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar PDF',
      });
      router.push('/success');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o PDF.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validação dos campos do consentimento
    if (!signature || !cpf || !rg || !birthDate) {
      Alert.alert(
        'Formulário incompleto',
        'Por favor, preencha todos os campos e assine o termo de consentimento.'
      );
      setLoading(false);
      return;
    }

    try {
      // Combina os dados do questionário (já salvos no contexto) com os dados do consentimento
      const completePDFData = {
        header: pdfData.header || headerInfo,
        responses: pdfData.responses || {},
        cpf,
        rg,
        birthDate,
        signature,
      };

      // Gera o PDF e obtém o caminho do arquivo temporário
      const pdfPath = await generatePDF(completePDFData);
      // Move o PDF para o armazenamento local do app
      const localPath = await savePDFToLocal(pdfPath);

      Alert.alert('PDF Gerado', `O PDF foi gerado em:\n${localPath}`, [
        {
          text: 'Compartilhar',
          onPress: () => handleShare(localPath),
        },
        {
          text: 'Fechar',
          onPress: () => router.push('/success'),
          style: 'cancel',
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar ou salvar o PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerInfo={headerInfo} />

      <ScrollView style={styles.scrollView}>
        <ConsentForm
          signature={signature}
          setSignature={setSignature}
          cpf={cpf}
          setCpf={setCpf}
          rg={rg}
          setRg={setRg}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          onSubmit={handleSubmit}
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
