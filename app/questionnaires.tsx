import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { questionnaires } from '../data/questionnaires';
import { Heart, Stethoscope, Activity, Scan } from 'lucide-react-native';
import Header from '../components/Header';
import { PDFDataContext } from './context/PDFDataContext';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'heart':
      return <Heart size={28} color={Colors.primary} />;
    case 'stethoscope':
      return <Stethoscope size={28} color={Colors.primary} />;
    case 'activity':
      return <Activity size={28} color={Colors.primary} />;
    case 'scan':
      return <Scan size={28} color={Colors.primary} />;
    default:
      return <Activity size={28} color={Colors.primary} />;
  }
};

export default function QuestionnairesScreen() {
  const pdfContext = useContext(PDFDataContext);
  if (!pdfContext) return null;

  const { setPDFData } = pdfContext;

  const handleQuestionnairePress = (questionnaire: any) => {
    // Atualiza o context com o questionnaireId selecionado.
    setPDFData((prev) => ({
      ...prev,
      questionnaireId: questionnaire.id,
    }));
    router.push(`/form/${questionnaire.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.title}>Selecione o Questionário</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.questionnairesContainer}>
          {questionnaires.map((questionnaire: any) => (
            <TouchableOpacity
              key={questionnaire.id}
              style={styles.questionnaireCard}
              onPress={() => handleQuestionnairePress(questionnaire)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                {getIcon(questionnaire.icon)}
              </View>
              <Text style={styles.questionnaireTitle}>
                {questionnaire.title}
              </Text>
            </TouchableOpacity>
          ))}
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
  title: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questionnairesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  questionnaireCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  questionnaireTitle: {
    ...TextStyles.subtitle,
    textAlign: 'center',
    color: Colors.black,
  },
});
