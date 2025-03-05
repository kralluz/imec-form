// app/form/[id].tsx
import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DynamicForm from '../../components/DynamicForm';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { questionnaires } from '@/data/questionnaires';
import { PDFDataContext } from '../context/PDFDataContext';
import Header from '@/components/Header';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pdfData, setPDFData, addOrUpdateForm } = useContext(PDFDataContext)!;

    const currentQuestionnaire = questionnaires.find((q: any) => q.id === id);


  const onSubmit = (data: Record<string, any>) => {
    setPDFData((prev) => ({ ...prev, responses: data, questionnaireId: id }));
      router.push(`/consent/${id}`);
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header />
        <Text style={styles.title}>{currentQuestionnaire?.title}</Text>
        <DynamicForm
          questions={currentQuestionnaire?.questions}
          onSubmit={onSubmit}
          defaultValues={pdfData.responses || {}}
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
