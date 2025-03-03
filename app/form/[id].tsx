// app/form/[id].tsx
import React, { useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';
import { getDeviceInfo } from '../../utils/deviceInfo';
import { HeaderInfo, QuestionnaireType } from '../../types';
import Header from '../../components/Header';
import Question from '../../components/Question';
import Button from '../../components/Button';
import { PDFDataContext } from '@/context/PDFDataContext';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tomografiaQuestions, formSchema, FormData, QuestionType } from '../../TomografiaQuestions';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id: QuestionnaireType }>();
  const { setPDFData } = useContext(PDFDataContext)!;
  const contentFade = useRef(new Animated.Value(0)).current;
  const [headerInfo, setHeaderInfo] = React.useState<HeaderInfo>({
    date: '',
    time: '',
    ip: '',
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const questionRefs = useRef<Record<string, any>>({});

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }, // Add isSubmitting
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacienteNome: '',
      motivo: '',
      cirurgia: '',
      cirurgiaTempo: '',
      cirurgiaQual: '',
      tratamento: '',
      tratamentoSessoes: '',
      medicamento: '',
      alergia: '',
      gravidez: '',
      comorbidades: '',
      fumante: '',
      fumanteTempo: '',
    },
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await getDeviceInfo();
      setHeaderInfo(info);
    };

    fetchDeviceInfo();

    Animated.timing(contentFade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [contentFade]);

  const onSubmit = (data: FormData) => {
    try {
      let modifiedData: any = { ...data };
      if (modifiedData.fumante === 'nao') {
        delete modifiedData.fumanteTempo;
      }

      setPDFData((prev) => ({
        ...prev,
        header: headerInfo,
        responses: modifiedData,
      }));
      router.push(`/consent/${id}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível prosseguir.');
    }
  };
    const scrollToFirstError = async () => { // Make it async
      const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
          const firstErrorKey = errorKeys[0];
          const firstErrorRef = questionRefs.current[firstErrorKey];

            if (firstErrorRef) {
               await new Promise(resolve => { // Add await and Promise
                    firstErrorRef.measureLayout(
                        // @ts-ignore
                        scrollViewRef.current,
                        (x: number, y: number) => {
                            scrollViewRef.current?.scrollTo({ y, animated: true });
                            resolve(null); // Resolve the promise after scrolling
                        },
                        () => {
                            console.error("Failed to measure layout");
                            resolve(null); // Resolve even if measurement fails
                        }
                    );
                });
            }
        }
    };

  const isQuestionVisible = (question: QuestionType, watchedValues: Record<string, any>) => {
    if (!question.dependsOn) {
      return true;
    }

    const dependencyValue = watchedValues[question.dependsOn.questionId];
    return dependencyValue === question.dependsOn.value;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerInfo={headerInfo} />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { opacity: contentFade }]}
        keyboardShouldPersistTaps="handled" // Add this line

      >
        <Text style={styles.title}>Questionário para Exames de Tomografia</Text>

        <View style={styles.questionsContainer}>
          {tomografiaQuestions.map((question) => {
            const watchedValues = watch();

            if (!isQuestionVisible(question, watchedValues)) {
              return null;
            }

            return (
              <Animated.View
                key={question.id}
                style={fadeStyle(contentFade)}
                ref={(el) => (questionRefs.current[question.id] = el)}
              >
                <Controller
                  control={control}
                  name={question.id as keyof FormData}
                  render={({ field: { onChange, value } }) => (
                    <Question
                      question={question}
                      value={value}
                      onChange={onChange}
                      error={errors[question.id as keyof FormData]?.message}
                    />
                  )}
                />
              </Animated.View>
            );
          })}
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
                onPress={async () => { // Make onPress async
                    if (isSubmitting) return; // Prevent multiple submissions
                    const isValid = await handleSubmit(onSubmit, scrollToFirstError)(); // Await handleSubmit
                }}
                loading={isSubmitting} // Use isSubmitting for loading state
                style={styles.button}
            />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const fadeStyle = (fade: Animated.Value) => ({
  opacity: fade,
  transform: [
    {
      translateY: fade.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
      }),
    },
  ],
});

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    ...TextStyles.title,
    color: Colors.primary,
    marginVertical: 20,
    textAlign: 'center',
  },
  questionsContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  errorText: {
    ...TextStyles.body,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});