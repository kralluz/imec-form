import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { Plus } from 'lucide-react-native';
import { PDFDataContext } from './context/PDFDataContext';

const HomeScreen = () => {
  const router = useRouter();
  const pdfContext = useContext(PDFDataContext);

  if (!pdfContext) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar os dados.</Text>
      </SafeAreaView>
    );
  }

  const { getAllForms } = pdfContext;
  const savedForms = getAllForms() || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logoimecdiagnostico.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao Sistema de Questionários</Text>

        <NewInterviewButton onPress={() => router.push('/technicians')} />

        <FormList savedForms={savedForms} router={router} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Botão para nova entrevista
const NewInterviewButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={styles.newExamCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Plus size={24} color={Colors.primary} />
    <Text style={styles.newExamText}>Nova Entrevista</Text>
  </TouchableOpacity>
);

// Lista de formulários salvos
const FormList = ({
  savedForms,
  router,
}: {
  savedForms: any[];
  router: any;
}) => {
  if (savedForms.length === 0) return null;

  return (
    <View style={styles.savedFormsContainer}>
      <Text style={styles.savedFormsTitle}>Formulários Anteriores:</Text>
      {savedForms.map((form) => (
        <TouchableOpacity
          key={form.id}
          style={styles.savedFormCard}
          onPress={() => router.push(`/viewForm/${form.id}`)}
          activeOpacity={0.8}
        >
          <Text style={styles.savedFormText}>
            {form.header?.formatted || 'Formulário sem data'}
          </Text>
          <Text style={styles.infoText}>{`Respostas: ${
            form.responses?.length || 0
          }`}</Text>
          {form.signature && (
            <Text style={styles.infoText}>Assinatura presente</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  logo: { width: 160, height: 60 },
  content: { paddingHorizontal: 20 },
  title: { ...TextStyles.heading3, textAlign: 'center', marginBottom: 20 },
  newExamCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  newExamText: {
    ...TextStyles.subtitle,
    color: Colors.primary,
    marginLeft: 10,
  },
  savedFormsContainer: { marginTop: 20 },
  savedFormsTitle: {
    ...TextStyles.subtitle,
    marginBottom: 10,
    color: Colors.black,
  },
  savedFormCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  savedFormText: { ...TextStyles.body, color: Colors.black },
  infoText: { ...TextStyles.caption, color: Colors.gray[700], marginTop: 4 },
  errorText: {
    ...TextStyles.body,
    textAlign: 'center',
    color: Colors.error,
    marginTop: 20,
  },
});

export default HomeScreen;
