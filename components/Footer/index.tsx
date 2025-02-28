import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { styles } from './styles';
import { ConsentFormData } from '../ConsentForm';

interface FooterProps {
  control: Control<ConsentFormData>;
  errors: FieldErrors<ConsentFormData>;
}

const Footer: React.FC<FooterProps> = ({ control, errors }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF:</Text>
          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="000.000.000-00"
                keyboardType="numeric"
              />
            )}
          />
          {errors.cpf && (
            <Text style={styles.errorText}>{errors.cpf.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>RG:</Text>
          <Controller
            control={control}
            name="rg"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="00.000.000-0"
              />
            )}
          />
          {errors.rg && (
            <Text style={styles.errorText}>{errors.rg.message}</Text>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data de Nascimento:</Text>
        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
            />
          )}
        />
        {errors.birthDate && (
          <Text style={styles.errorText}>{errors.birthDate.message}</Text>
        )}
      </View>
    </View>
  );
};

export default Footer;
