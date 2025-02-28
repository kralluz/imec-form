// app/form/[id].tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { getDeviceInfo } from '../../utils/deviceInfo';
import { HeaderInfo, FormData, QuestionnaireType } from '../../types';
import Header from '../../components/Header';
import Question from '../../components/Question';
import Button from '../../components/Button';
import { PDFDataContext } from '@/context/PDFDataContext';

// Questionário estático para exames de tomografia
const staticQuestionnaires = [
  {
    id: 'tomografia',
    title: 'Questionário para Exames de Tomografia',
    questions: [
      {
        id: 'pacienteNome',
        text: 'PACIENTE NOME',
        type: 'text',
      },
      {
        id: 'motivo',
        text: 'Por que motivo seu médico solicitou o exame de tomografia computadorizada?',
        type: 'textarea',
      },
      {
        id: 'cirurgia',
        text: 'Fez alguma cirurgia?',
        type: 'radio',
        options: [
          { id: 'sim', label: 'Sim', value: 'sim' },
          { id: 'nao', label: 'Não', value: 'nao' },
        ],
        conditionalQuestions: [
          {
            value: 'sim',
            questions: [
              { id: 'cirurgiaTempo', text: 'Há quanto tempo?', type: 'text' },
              { id: 'cirurgiaQual', text: 'Qual cirurgia?', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'tratamento',
        text: 'Já realizou radioterapia, quimioterapia ou similar?',
        type: 'radio',
        options: [
          { id: 'sim', label: 'Sim', value: 'sim' },
          { id: 'nao', label: 'Não', value: 'nao' },
        ],
        conditionalQuestions: [
          {
            value: 'sim',
            questions: [
              { id: 'tratamentoSessoes', text: 'Quantas sessões?', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'medicamento',
        text: 'Faz uso de algum medicamento de uso contínuo?',
        type: 'radio',
        options: [
          { id: 'sim', label: 'Sim', value: 'sim' },
          { id: 'nao', label: 'Não', value: 'nao' },
        ],
      },
      {
        id: 'alergia',
        text: 'Tem algum outro tipo de alergia?',
        type: 'radio',
        options: [
          { id: 'sim', label: 'Sim', value: 'sim' },
          { id: 'nao', label: 'Não', value: 'nao' },
        ],
      },
      {
        id: 'gravidez',
        text: 'Suspeita de gravidez?',
        type: 'radio',
        options: [
          { id: 'sim', label: 'Sim', value: 'sim' },
          { id: 'nao', label: 'Não', value: 'nao' },
        ],
      },
      {
        id: 'comorbidades',
        text: 'Tem diabetes, hipertensão, doenças renais, asma, bronquite?',
        type: 'radio',
        options: [
          { id: 'nao', label: 'Não', value: 'nao' },
          { id: 'sim', label: 'Sim', value: 'sim' },
        ],
      },
      {
        id: 'fumante',
        text: 'É fumante?',
        type: 'radio',
        options: [
          { id: 'sim', label: 'Sim', value: 'sim' },
          { id: 'nao', label: 'Não', value: 'nao' },
        ],
        conditionalQuestions: [
          {
            value: 'sim',
            questions: [
              { id: 'fumanteTempo', text: 'Há quanto tempo?', type: 'text' },
            ],
          },
        ],
      },
    ],
  },
];

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id: QuestionnaireType }>();
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    date: '',
    time: '',
    ip: '',
    mask: '',
    mac: '',
  });
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const { setPDFData } = useContext(PDFDataContext)!; // garante que o contexto esteja disponível

  // Busca o questionário estático de tomografia
  const questionnaire = staticQuestionnaires.find((q) => q.id === id);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setHeaderInfo(info);
    };

    fetchDeviceInfo();
  }, []);

  const handleQuestionChange = (questionId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validação: verifica se todas as perguntas obrigatórias foram respondidas
    const isValid = questionnaire?.questions.every((question) => {
      if (question.type === 'radio' || question.type === 'checkbox') {
        return formData[question.id] !== undefined;
      }
      return true;
    });

    if (!isValid) {
      Alert.alert(
        'Formulário incompleto',
        'Por favor, responda todas as perguntas obrigatórias.'
      );
      setLoading(false);
      return;
    }

    try {
      // Salva os dados do questionário e informações do dispositivo no contexto
      setPDFData((prev) => ({
        ...prev,
        header: headerInfo,
        responses: formData,
      }));

      // Navega para a tela de consentimento, passando o mesmo id do questionário
      router.push(`/consent/${id}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível prosseguir para o consentimento.');
    } finally {
      setLoading(false);
    }
  };

  if (!questionnaire) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Questionário não encontrado</Text>
        <Button
          title="Voltar"
          onPress={() => router.back()}
          variant="outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header headerInfo={headerInfo} />

      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{questionnaire.title}</Text>

        <View style={styles.questionsContainer}>
          {questionnaire.questions.map((question: any) => (
            <Question
              key={question.id}
              question={question}
              value={formData[question.id]}
              onChange={handleQuestionChange}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Voltar"
            onPress={() => router.back()}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Próximo"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}
          />
        </View>
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
  title: {
    ...TextStyles.heading2,
    marginBottom: 24,
    textAlign: 'center',
  },
  questionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  button: {
    flex: 0.48,
  },
  errorText: {
    ...TextStyles.heading3,
    color: Colors.error,
    textAlign: 'center',
    marginVertical: 24,
  },
});
