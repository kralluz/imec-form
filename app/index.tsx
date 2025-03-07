// app/index.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logoimecdiagnostico.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao Sistema de Questionários</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/forms' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Selecionar Técnico</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 160,
    height: 60,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    ...TextStyles.subtitle,
    color: Colors.white,
  },
});
