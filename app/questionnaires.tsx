import React from 'react';
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

import {
  Brain,
  Waves,
  Stethoscope,
  ScanFace,
  Eye,
  Inspect,
  Activity,
} from 'lucide-react-native';
import Header from '../components/Header';

const getIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('tomografia')) {
    return <Brain size={28} color={Colors.primary} />;
  }
  if (
    lowerTitle.includes('ressonancia') ||
    lowerTitle.includes('ressonância')
  ) {
    return <Waves size={28} color={Colors.primary} />;
  }
  if (lowerTitle.includes('mamografia')) {
    return <Stethoscope size={28} color={Colors.primary} />;
  }
  if (lowerTitle.includes('raio-x')) {
    return <ScanFace size={28} color={Colors.primary} />;
  }
  if (lowerTitle.includes('endoscopia')) {
    return <Eye size={28} color={Colors.primary} />;
  }
  if (lowerTitle.includes('colonoscopia')) {
    return <Inspect size={28} color={Colors.primary} />;
  }

  return <Activity size={28} color={Colors.primary} />;
};

export default function QuestionnairesScreen() {
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
              onPress={() => router.push(`/form/${questionnaire.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                {getIcon(questionnaire.title)}
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
    borderColor: 'rgba(114, 159, 207, 0.685)',
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
