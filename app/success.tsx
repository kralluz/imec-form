import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import Button from '../components/Button';

export default function SuccessScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CheckCircle size={80} color={Colors.success} />
        
        <Text style={styles.title}>Enviado com sucesso!</Text>
        
        <Text style={styles.message}>
          Seu questionário e termo de consentimento foram enviados com sucesso.
          Obrigado por completar o processo.
        </Text>
        
        <Button
          title="Voltar ao Início"
          onPress={() => router.replace('/')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    ...TextStyles.heading2,
    color: Colors.success,
    marginTop: 24,
    marginBottom: 16,
  },
  message: {
    ...TextStyles.body,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});