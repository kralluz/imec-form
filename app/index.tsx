// app/index.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Heart, Stethoscope, Activity, Scan } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { questionnaires } from '../data/questionnaires';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'heart':
      return <Heart size={32} color={Colors.primary} />;
    case 'stethoscope':
      return <Stethoscope size={32} color={Colors.primary} />;
    case 'activity':
      return <Activity size={32} color={Colors.primary} />;
    case 'scan':
      return <Scan size={32} color={Colors.primary} />;
    default:
      return <Activity size={32} color={Colors.primary} />;
  }
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>IMEC Diagnóstico</Text>
      </View>
      
      <Text style={styles.title}>Selecione o questionário</Text>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.questionnairesContainer}>
          {questionnaires.map((questionnaire) => (
            <TouchableOpacity
              key={questionnaire.id}
              style={styles.questionnaireCard}
              onPress={() => router.push(`/form/${questionnaire.id}`)}
            >
              <View style={styles.iconContainer}>
                {getIcon(questionnaire.icon)}
              </View>
              <Text style={styles.questionnaireTitle}>{questionnaire.title}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoText: {
    ...TextStyles.heading2,
    color: Colors.primary,
  },
  title: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginVertical: 24,
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 150,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  questionnaireTitle: {
    ...TextStyles.subtitle,
    textAlign: 'center',
  },
});