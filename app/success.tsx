import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { PDFDataContext } from './context/PDFDataContext';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';

const SuccessScreen = () => {
  const { pdfData } = useContext(PDFDataContext)!;

  const handleShare = async () => {
    try {
      // Recupere o último PDF salvo
      const forms = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      const latestForm = forms
        .filter((file) => file.startsWith('document') && file.endsWith('.pdf'))
        .sort()
        .pop(); // Pega o mais recente

      if (!latestForm) {
        Alert.alert('Erro', 'Nenhum formulário encontrado para compartilhar.');
        return;
      }
      const pdfPath = FileSystem.documentDirectory + latestForm;

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Compartilhamento não disponível',
          'Este dispositivo não suporta compartilhamento de arquivos.'
        );
        return;
      }
      await Sharing.shareAsync(pdfPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar PDF',
      });
    } catch (error) {
      console.error('Erro ao compartilhar o PDF:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Formulário enviado com sucesso!</Text>
        <Text style={styles.message}>
          Obrigado por preencher o questionário.
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.shareButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    ...TextStyles.heading2,
    marginBottom: 20,
    color: Colors.primary,
  },
  message: {
    ...TextStyles.body,
    textAlign: 'center',
    color: Colors.black,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  shareButtonText: {
    ...TextStyles.subtitle,
    color: Colors.white,
  },
});

export default SuccessScreen;
