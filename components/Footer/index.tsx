import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './styles';

interface FooterProps {
  cpf: string;
  setCpf: (value: string) => void;
  rg: string;
  setRg: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
}

const Footer: React.FC<FooterProps> = ({
  cpf,
  setCpf,
  rg,
  setRg,
  birthDate,
  setBirthDate,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF:</Text>
          <TextInput
            style={styles.input}
            value={cpf}
            onChangeText={setCpf}
            placeholder="000.000.000-00"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>RG:</Text>
          <TextInput
            style={styles.input}
            value={rg}
            onChangeText={setRg}
            placeholder="00.000.000-0"
            keyboardType="default"
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data de Nascimento:</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

export default Footer;