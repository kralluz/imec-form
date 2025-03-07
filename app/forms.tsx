import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { PDFDataContext } from './context/PDFDataContext';
import { ConsentPDFData } from '@/utils/generatePdf';
import Header from '@/components/Header';

const FormScreens = () => {
  const router = useRouter();
  const { savedForms, deleteForm, generatePDF } = useContext(PDFDataContext)!;

  // Função para compartilhar o formulário
  const handleShare = async (form: ConsentPDFData) => {
    try {
      const pdfUri = await generatePDF(form);
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Compartilhamento não disponível',
          'Este dispositivo não suporta compartilhamento de arquivos.'
        );
        return;
      }
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar PDF',
      });
    } catch (error) {
      console.error('Erro ao compartilhar formulário:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o formulário.');
    }
  };

  // Função para excluir o formulário
  const handleDelete = (formId: string | undefined) => {
    if (!formId) return;
    Alert.alert(
      'Excluir formulário',
      'Deseja realmente excluir este formulário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteForm(formId);
            } catch (error) {
              console.error('Erro ao excluir formulário:', error);
              Alert.alert('Erro', 'Não foi possível excluir o formulário.');
            }
          },
        },
      ]
    );
  };

  const renderFormItem = (form: ConsentPDFData) => {
    return (
      <View key={form.id} style={styles.formItem}>
        <Text style={styles.formTitle}>Formulário de {form.header.date}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleShare(form)}
          >
            <Text style={styles.buttonText}>Compartilhar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(form.id)}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity
        style={styles.newButton}
        onPress={() => router.push('/technicians')}
      >
        <Text style={styles.newButtonText}>Novo Formulário</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {savedForms && savedForms.length > 0 ? (
          savedForms.map(renderFormItem)
        ) : (
          <Text style={styles.emptyText}>Nenhum formulário salvo.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default FormScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC', // tom bem claro, remetendo a ambiente hospitalar
  },
  newButton: {
    backgroundColor: '#007ACC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 20,
    elevation: 2,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  formItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D0D7DE',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    backgroundColor: '#28A745',
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777',
  },
});
 