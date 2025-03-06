import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DynamicForm, { Question } from '../../components/DynamicForm';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { questionnaires } from '@/data/questionnaires';
import { PDFDataContext } from '../context/PDFDataContext';
import Header from '@/components/Header';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pdfData, setPDFData, resetPDFData, getFormById } =
    useContext(PDFDataContext)!;

  const savedForm = getFormById(id);

  const currentQuestionnaire = savedForm
    ? questionnaires.find((q: any) => q.id === savedForm.questionnaireId)
    : questionnaires.find((q: any) => q.id === id);

  const defaultValues = savedForm
    ? savedForm.responses.reduce((acc: Record<string, any>, entry) => {
        acc[entry.questionId] = entry.answer;
        return acc;
      }, {})
    : {};

  useEffect(() => {
    resetPDFData();

    const form = getFormById(id);
    if (form) {
      setPDFData((prev) => ({
        ...prev,
        id: form.id,
        responses: form.responses,
        questionnaireId: form.questionnaireId,
        consent: { signature: form.signature },
        header: form.header,
        radiologyTechnician: form.radiologyTechnician,
        nursingTechnician: form.nursingTechnician,
      }));
    }
    // Executa apenas quando o "id" mudar
  }, [id]);

  const flattenQuestions = (
    questions: Question[],
    answers: Record<string, any>
  ) => {
    let responses: any[] = [];
    for (const question of questions) {
      responses.push({
        questionId: question.id,
        questionText: question.text,
        answer: answers[question.id] ?? null,
      });
      if (question.conditionalQuestions) {
        question.conditionalQuestions.forEach((cond) => {
          if (
            answers[question.id] === cond.value ||
            (Array.isArray(answers[question.id]) &&
              answers[question.id].includes(cond.value))
          ) {
            responses = responses.concat(
              flattenQuestions(cond.questions, answers)
            );
          }
        });
      }
    }
    return responses;
  };

  const onSubmit = (data: Record<string, any>) => {
    if (!currentQuestionnaire) {
      console.error('Questionário não encontrado.');
      return;
    }
    const responsesWithQuestions = flattenQuestions(
      currentQuestionnaire.questions,
      data
    );

    setPDFData((prev) => ({
      ...prev,
      responses: responsesWithQuestions,
      questionnaireId: currentQuestionnaire.id,
    }));

    router.push(`/consent/${currentQuestionnaire.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <Text style={styles.title}>{currentQuestionnaire?.title}</Text>
        <DynamicForm
          questions={currentQuestionnaire?.questions || []}
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
