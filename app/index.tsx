
// app/index.tsx
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
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { PDFDataContext, ConsentPDFData } from './context/PDFDataContext';
import { Plus } from 'lucide-react-native';

export default function HomeScreen() {
  const { savedForms } = useContext(PDFDataContext)!;

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

        <TouchableOpacity
          style={styles.newExamCard}
          onPress={() => router.push('/technicians')}
          activeOpacity={0.8}
        >
          <Plus size={24} color={Colors.primary} />
          <Text style={styles.newExamText}>Nova Entrevista</Text>
        </TouchableOpacity>

        {savedForms.length > 0 && (
          <View style={styles.savedFormsContainer}>
            <Text style={styles.savedFormsTitle}>Formulários Anteriores:</Text>
            {savedForms.map((form: any) => (
              <TouchableOpacity
                key={form.id}
                style={styles.savedFormCard}
                onPress={() => router.push(`/form/${form.questionnaireId}`)} // Use questionnaireId
                activeOpacity={0.8}
              >
                <Text style={styles.savedFormText}>
                  {form.header?.formatted || 'Formulário sem data'}
                </Text>
                {/* Adicione mais detalhes do formulário se necessário */}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 60,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginBottom: 20,
  },
  newExamCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  newExamText: {
    ...TextStyles.subtitle,
    color: Colors.primary,
    marginLeft: 10,
  },
  savedFormsContainer: {
    marginTop: 20,
  },
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
  savedFormText: {
    ...TextStyles.body,
    color: Colors.black,
  },
});
