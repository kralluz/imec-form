
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { consentText } from '@/data/consentText';
import { TextStyles } from '@/constants/Typography';
import Colors from '@/constants/Colors';

interface ConsentFormProps {
  onSubmit: (data: any) => void;
  openSignature: () => void;
  signature?: string; // Assinatura (opcional)
  existingConsent?: any;
}

const ConsentForm: React.FC<ConsentFormProps> = ({
  onSubmit,
  openSignature,
  signature,
  existingConsent,
}) => {
  const [cpf, setCpf] = React.useState(existingConsent?.cpf || '');
  const [rg, setRg] = React.useState(existingConsent?.rg || '');
  const [birthDate, setBirthDate] = React.useState(
    existingConsent?.birthDate || ''
  );

  const handleSubmit = () => {
    // Validação (exemplo simples - você pode querer uma validação mais robusta)
    if (!cpf || !rg || !birthDate) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    onSubmit({ cpf, rg, birthDate });
  };

  return (
    <View>
      <Text style={styles.title}>Termo de Consentimento</Text>
      <ScrollView
        style={styles.consentScrollView}
        contentContainerStyle={styles.consentContent}
      >
        <Text style={styles.consentText}>{consentText}</Text>
      </ScrollView>
      <View style={styles.formGroup}>
        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>RG:</Text>
        <TextInput style={styles.input} value={rg} onChangeText={setRg} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Data de Nascimento:</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="DD/MM/AAAA"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Assinatura:</Text>
        <TouchableOpacity style={styles.signatureButton} onPress={openSignature}>
          <Text style={styles.signatureButtonText}>
            {signature ? 'Assinatura Capturada' : 'Assinar'}
          </Text>
        </TouchableOpacity>
        {signature ? <Text>Assinatura OK</Text> : null}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Concluir</Text> {/* Alterado para Concluir */}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    ...TextStyles.heading3,
    marginBottom: 20,
    textAlign: 'center',
  },
  consentScrollView: {
    flex: 1,
    marginBottom: 16,
    maxHeight: 200,
  },
  consentContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  consentText: {
    textAlign: 'justify',
    lineHeight: 24,
    fontSize: 16,
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    ...TextStyles.body,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.white,
  },
  signatureButton: {
    backgroundColor: Colors.gray[200],
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signatureButtonText: {
    ...TextStyles.body,
    color: Colors.black,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    ...TextStyles.subtitle,
    color: Colors.white,
  },
});

export default ConsentForm;