import React, { useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { generatePDF } from '@/utils/generatePdf';
import { questionnaires } from '@/data/questionnaires';
import { PDFDataContext } from '@/app/context/PDFDataContext';
import Colors from '@/constants/Colors';
import Header from '@/components/Header';
import { consentText } from '@/data/consentText';
import Button from '@/components/Button';

const answerMapping: Record<string, string> = {
  yes: 'Sim',
  no: 'Não',
  na: 'Não se aplica',
};

export default function ReviewScreen() {
  const { pdfData } = useContext(PDFDataContext)!;

  const currentQuestionnaire = questionnaires.find(
    (q: any) => q.id === pdfData.questionnaireId
  );

  // *** Fix: Check for pdfData.consent first ***
  const signatureStr = pdfData.consent?.signature;
  let signatureSrc = '';
  if (pdfData.consent && signatureStr && typeof signatureStr === 'string') {
    signatureSrc = signatureStr.startsWith('data:image')
      ? signatureStr
      : `data:image/png;base64,${signatureStr}`;
  }

  const handleConclude = async () => {
    try {
      const completePDFData: any = {
        header: pdfData.header,
        responses: pdfData.responses,
        cpf: pdfData.consent?.cpf || '',
        rg: pdfData.consent?.rg || '',
        birthDate: pdfData.consent?.birthDate || '',
        signature: pdfData.consent?.signature || '',
      };

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
      router.push('/success');
    } catch (error) {
      console.error('Erro ao gerar ou compartilhar o PDF:', error);
      Alert.alert('Erro', 'Não foi possível gerar ou compartilhar o PDF.');
    }
  };

  const handleEdit = () => {
    router.push(`/form/${pdfData.questionnaireId || ''}`);
  };

  const convertAnswer = (answer: any): string => {
    if (Array.isArray(answer)) {
      return answer.map((item) => answerMapping[item] || item).join(', ');
    }
    return answerMapping[answer] || answer?.toString() || 'Sem resposta';
  };

  const renderQuestion = (question: any) => {
    const answer = pdfData.responses ? pdfData.responses[question.id] : null;
    return (
      <View key={question.id} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>
        <Text style={styles.answerText}>{convertAnswer(answer)}</Text>
        {question.conditionalQuestions &&
          question.conditionalQuestions.map((cond: any) => {
            if (question.type === 'checkbox') {
              if (Array.isArray(answer) && answer.includes(cond.value)) {
                return cond.questions.map((subQ: any) => renderQuestion(subQ));
              }
            } else if (answer === cond.value) {
              return cond.questions.map((subQ: any) => renderQuestion(subQ));
            }
            return null;
          })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerInfo={pdfData.header || {}} />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Revisão dos Dados</Text>

        {pdfData.technician && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Técnico Selecionado</Text>
            <Text style={styles.sectionContent}>
              {pdfData.technician.name} - {pdfData.technician.specialty}
            </Text>
          </View>
        )}

        {currentQuestionnaire && pdfData.responses && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Respostas do Questionário</Text>
            {currentQuestionnaire.questions.map((question: any) =>
              renderQuestion(question)
            )}
          </View>
        )}

        {pdfData.consent && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Termo de Consentimento</Text>
            <Text style={styles.sectionContent}>{consentText}</Text>
            {signatureSrc ? (
              <Image
                style={styles.signatureImage}
                source={{ uri: signatureSrc }}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.sectionContent}>
                Assinatura não disponível
              </Text>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Editar" onPress={handleEdit} style={styles.button} />
          <Button
            title="Concluir"
            onPress={handleConclude}
            style={[styles.button, styles.concludeButton]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollView: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.primary,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.primary,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  questionContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  signatureImage: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: { flex: 1, marginHorizontal: 10 },
  concludeButton: {
    backgroundColor: '#28a745',
  },
});
