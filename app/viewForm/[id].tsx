import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';
import { PDFDataContext } from '../context/PDFDataContext';
import Colors from '@/constants/Colors';
import { TextStyles } from '@/constants/Typography';

const ViewFormScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pdfContext = useContext(PDFDataContext);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (pdfContext) {
      const savedForm = pdfContext.getFormById(id);
      setForm(savedForm || null);
    }
  }, [id, pdfContext]);

  if (!form) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Formulário não encontrado.</Text>
      </SafeAreaView>
    );
  }

  // Define a URI da imagem de forma dinâmica:
  // Se a assinatura começar com "file://", assume que é um caminho de arquivo;
  // Se não começar com "data:" então monta a string base64 completa.
  const getImageUri = () => {
    if (!form.signature) return '';
    if (form.signature.startsWith('file://')) {
      return form.signature;
    } else if (!form.signature.startsWith('data:')) {
      return `data:image/png;base64,${form.signature}`;
    }
    return form.signature;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Detalhes do Formulário</Text>

        <FormSection title="Cabeçalho">
          <Text style={styles.sectionText}>
            {form.header?.formatted || 'Sem data'}
          </Text>
        </FormSection>

        <FormResponses responses={form.responses} />

        <FormSection title="Assinatura">
          {form.signature ? (
            <Image
              source={{ uri: getImageUri() }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.sectionText}>Assinatura não fornecida.</Text>
          )}
        </FormSection>
      </ScrollView>
    </SafeAreaView>
  );
};

// Componente reutilizável para seções de texto e outros conteúdos
const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// Renderiza respostas do formulário
const FormResponses = ({ responses }: { responses: any[] }) => (
  <FormSection title="Respostas">
    {responses && responses.length > 0 ? (
      responses.map((resp, index) => (
        <View key={index} style={styles.responseItem}>
          <Text style={styles.questionText}>{resp.questionText}</Text>
          <Text style={styles.answerText}>
            Resposta: {resp.answer?.toString() || 'Não respondida'}
          </Text>
        </View>
      ))
    ) : (
      <Text style={styles.sectionText}>Nenhuma resposta registrada.</Text>
    )}
  </FormSection>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  title: {
    ...TextStyles.title,
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.primary,
  },
  section: {
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  sectionTitle: {
    ...TextStyles.subtitle,
    color: Colors.black,
    marginBottom: 8,
  },
  sectionText: { ...TextStyles.body, color: Colors.black },
  errorText: {
    ...TextStyles.body,
    textAlign: 'center',
    color: Colors.error,
    marginTop: 20,
  },
  responseItem: { marginBottom: 10 },
  questionText: { ...TextStyles.body, color: Colors.black },
  answerText: { ...TextStyles.caption, color: Colors.gray[700] },
  signatureImage: {
    width: '100%',
    height: 100,
    marginTop: 10,
    backgroundColor: Colors.gray[200],
    transform: [{ rotate: '90deg' }],
  },
});

export default ViewFormScreen;
