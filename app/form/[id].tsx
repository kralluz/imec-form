import React, { useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  Alert,
  StyleSheet,
  Dimensions,
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

import { z } from 'zod';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z
  .object({
    pacienteNome: z.string().min(1, { message: 'Obrig.' }),
    motivo: z.string().min(1, { message: 'Obrig.' }),
    cirurgia: z.enum(['sim', 'nao']).optional().or(z.literal('')),
    cirurgiaTempo: z.string().optional(),
    cirurgiaQual: z.string().optional(),
    tratamento: z.enum(['sim', 'nao']).optional().or(z.literal('')),
    tratamentoSessoes: z.string().optional(),
    medicamento: z.enum(['sim', 'nao']).optional().or(z.literal('')),
    alergia: z.enum(['sim', 'nao']).optional().or(z.literal('')),
    gravidez: z.enum(['sim', 'nao']).optional().or(z.literal('')),
    comorbidades: z.enum(['sim', 'nao']).optional().or(z.literal('')),
    fumante: z.enum(['sim', 'nao']).optional().or(z.literal('')),
    fumanteTempo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const enumFields = [
      'cirurgia',
      'tratamento',
      'medicamento',
      'alergia',
      'gravidez',
      'comorbidades',
      'fumante',
    ];
    enumFields.forEach((field) => {
      if ((data as any)[field] === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: [field],
        });
      }
    });

    if (data.cirurgia === 'sim') {
      if (!data.cirurgiaTempo || data.cirurgiaTempo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['cirurgiaTempo'],
        });
      }
      if (!data.cirurgiaQual || data.cirurgiaQual.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['cirurgiaQual'],
        });
      }
    }
    if (data.tratamento === 'sim') {
      if (!data.tratamentoSessoes || data.tratamentoSessoes.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['tratamentoSessoes'],
        });
      }
    }
    if (data.fumante === 'sim') {
      if (!data.fumanteTempo || data.fumanteTempo.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Obrig.',
          path: ['fumanteTempo'],
        });
      }
    }
  });

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id: QuestionnaireType }>();
  const { setPDFData } = useContext(PDFDataContext)!;
  const contentFade = useRef(new Animated.Value(0)).current;
  const [headerInfo, setHeaderInfo] = React.useState<HeaderInfo>({
    date: '',
    time: '',
    ip: '',
  });

  if (id !== 'tomografia') {
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

  type FormData = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const [watchCirurgia, watchTratamento, watchFumante] = useWatch({
    control,
    name: ['cirurgia', 'tratamento', 'fumante'],
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

  return (
    <SafeAreaView style={styles.container}>
      <Header headerInfo={headerInfo} />

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: contentFade }]}
      >
        <Text style={styles.title}>Questionário para Exames de Tomografia</Text>

        <View style={styles.questionsContainer}>
          {/* PACIENTE NOME */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="pacienteNome"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'pacienteNome',
                    text: 'PACIENTE NOME',
                    type: 'text',
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.pacienteNome?.message}
                />
              )}
            />
          </Animated.View>

          {/* MOTIVO */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="motivo"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'motivo',
                    text: 'Por que motivo seu médico solicitou o exame de tomografia computadorizada?',
                    type: 'textarea',
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.motivo?.message}
                />
              )}
            />
          </Animated.View>

          {/* CIRURGIA */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="cirurgia"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'cirurgia',
                    text: 'Fez alguma cirurgia?',
                    type: 'radio',
                    options: [
                      { id: 'sim', label: 'Sim', value: 'sim' },
                      { id: 'nao', label: 'Não', value: 'nao' },
                    ],
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.cirurgia?.message}
                />
              )}
            />
          </Animated.View>

          {/* Condicional: Se cirurgia === "sim" */}
          {watchCirurgia === 'sim' && (
            <>
              <Animated.View style={fadeStyle(contentFade)}>
                <Controller
                  control={control}
                  name="cirurgiaTempo"
                  render={({ field: { onChange, value } }) => (
                    <Question
                      question={{
                        id: 'cirurgiaTempo',
                        text: 'Há quanto tempo?',
                        type: 'text',
                      }}
                      value={value}
                      onChange={(val) => onChange(val)}
                      error={errors.cirurgiaTempo?.message}
                    />
                  )}
                />
              </Animated.View>
              <Animated.View style={fadeStyle(contentFade)}>
                <Controller
                  control={control}
                  name="cirurgiaQual"
                  render={({ field: { onChange, value } }) => (
                    <Question
                      question={{
                        id: 'cirurgiaQual',
                        text: 'Qual cirurgia?',
                        type: 'text',
                      }}
                      value={value}
                      onChange={(val) => onChange(val)}
                      error={errors.cirurgiaQual?.message}
                    />
                  )}
                />
              </Animated.View>
            </>
          )}

          {/* TRATAMENTO */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="tratamento"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'tratamento',
                    text: 'Já realizou radioterapia, quimioterapia ou similar?',
                    type: 'radio',
                    options: [
                      { id: 'sim', label: 'Sim', value: 'sim' },
                      { id: 'nao', label: 'Não', value: 'nao' },
                    ],
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.tratamento?.message}
                />
              )}
            />
          </Animated.View>

          {/* Condicional: Se tratamento === "sim" */}
          {watchTratamento === 'sim' && (
            <Animated.View style={fadeStyle(contentFade)}>
              <Controller
                control={control}
                name="tratamentoSessoes"
                render={({ field: { onChange, value } }) => (
                  <Question
                    question={{
                      id: 'tratamentoSessoes',
                      text: 'Quantas sessões?',
                      type: 'text',
                    }}
                    value={value}
                    onChange={(val) => onChange(val)}
                    error={errors.tratamentoSessoes?.message}
                  />
                )}
              />
            </Animated.View>
          )}

          {/* MEDICAMENTO */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="medicamento"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'medicamento',
                    text: 'Faz uso de algum medicamento de uso contínuo?',
                    type: 'radio',
                    options: [
                      { id: 'sim', label: 'Sim', value: 'sim' },
                      { id: 'nao', label: 'Não', value: 'nao' },
                    ],
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.medicamento?.message}
                />
              )}
            />
          </Animated.View>

          {/* ALERGIA */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="alergia"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'alergia',
                    text: 'Tem algum outro tipo de alergia?',
                    type: 'radio',
                    options: [
                      { id: 'sim', label: 'Sim', value: 'sim' },
                      { id: 'nao', label: 'Não', value: 'nao' },
                    ],
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.alergia?.message}
                />
              )}
            />
          </Animated.View>

          {/* GRAVIDEZ */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="gravidez"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'gravidez',
                    text: 'Suspeita de gravidez?',
                    type: 'radio',
                    options: [
                      { id: 'sim', label: 'Sim', value: 'sim' },
                      { id: 'nao', label: 'Não', value: 'nao' },
                    ],
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.gravidez?.message}
                />
              )}
            />
          </Animated.View>

          {/* COMORBIDADES */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="comorbidades"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'comorbidades',
                    text: 'Tem diabetes, hipertensão, doenças renais, asma, bronquite?',
                    type: 'radio',
                    options: [
                      { id: 'nao', label: 'Não', value: 'nao' },
                      { id: 'sim', label: 'Sim', value: 'sim' },
                    ],
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.comorbidades?.message}
                />
              )}
            />
          </Animated.View>

          {/* FUMANTE */}
          <Animated.View style={fadeStyle(contentFade)}>
            <Controller
              control={control}
              name="fumante"
              render={({ field: { onChange, value } }) => (
                <Question
                  question={{
                    id: 'fumante',
                    text: 'É fumante?',
                    type: 'radio',
                    options: [
                      { id: 'sim', label: 'Sim', value: 'sim' },
                      { id: 'nao', label: 'Não', value: 'nao' },
                    ],
                  }}
                  value={value}
                  onChange={(val) => onChange(val)}
                  error={errors.fumante?.message}
                />
              )}
            />
          </Animated.View>

          {/* Condicional: Se fumante === "sim" */}
          {watchFumante === 'sim' && (
            <Animated.View style={fadeStyle(contentFade)}>
              <Controller
                control={control}
                name="fumanteTempo"
                render={({ field: { onChange, value } }) => (
                  <Question
                    question={{
                      id: 'fumanteTempo',
                      text: 'Há quanto tempo?',
                      type: 'text',
                    }}
                    value={value}
                    onChange={(val) => onChange(val)}
                    error={errors.fumanteTempo?.message}
                  />
                )}
              />
            </Animated.View>
          )}
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
            onPress={handleSubmit(onSubmit)}
            loading={false}
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
