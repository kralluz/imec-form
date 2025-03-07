// app/form/[id].tsx
import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DynamicForm from '../../components/DynamicForm';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { questionnaires } from '@/data/questionnaires';
import { PDFDataContext } from '../context/PDFDataContext';
import Header from '@/components/Header';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pdfData, setPDFData } = useContext(PDFDataContext)!;

  const currentQuestionnaire = questionnaires.find((q: any) => q.id === id);

  const onSubmit = (data: Record<string, any>) => {
    
    Alert.alert('Formulário enviado com sucesso!');
    if (!currentQuestionnaire) return;

    // Monta as respostas já associando cada pergunta (id e texto)
    const responsesWithQuestions = currentQuestionnaire.questions.map(
      (q: any) => ({
        id: q.id,
        question: q.text,
        answer: data[q.id],
      })
    );

    setPDFData((prev) => ({
      ...prev,
      responses: responsesWithQuestions,
      questionnaire: { id, title: currentQuestionnaire.title },
    }));

    router.push(`/consent/${id}`);
  };

  if (!currentQuestionnaire) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Questionário não encontrado</Text>
      </SafeAreaView>
    );
  }

  // Reconstrói os valores iniciais com base na nova estrutura (se houver)
  const defaultValues = pdfData.responses
    ? pdfData.responses.reduce(
        (acc: any, curr: any) => ({ ...acc, [curr.id]: curr.answer }),
        {}
      )
    : {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <Text style={styles.title}>{currentQuestionnaire.title}</Text>
        <DynamicForm
          questions={currentQuestionnaire.questions}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1, padding: 16 },
  title: {
    ...TextStyles.title,
    color: Colors.primary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
