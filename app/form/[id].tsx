// app/form/[id].tsx
import React, { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
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
    console.log('🚀 ~ onSubmit ~ data:', data);

    // Verifica se há alguma chave com valor undefined
    const hasUndefined = currentQuestionnaire.questions.some(
      (q: any) => data[q.id] === undefined
    );

    if (hasUndefined) {
      Alert.alert(
        'Erro',
        'Por favor, preencha todos os campos antes de prosseguir.'
      );
      return;
    }

    Alert.alert('Formulário enviado com sucesso!');

    if (!currentQuestionnaire) return;

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

  const defaultValues = pdfData.responses
    ? pdfData.responses.reduce(
        (acc: any, curr: any) => ({ ...acc, [curr.id]: curr.answer }),
        {}
      )
    : {};

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    ...TextStyles.title,
    color: Colors.primary,
    marginVertical: 20,
    textAlign: 'center',
  },
});
