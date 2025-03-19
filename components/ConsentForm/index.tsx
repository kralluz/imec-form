import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../Button';
import SignatureModal from '../SignatureModal';
import { consentText } from '../../data/consentText';

export const consentSchema = z.object({
  signature: z.string().nonempty('Assinatura é obrigatória'),
});

export type ConsentFormData = z.infer<typeof consentSchema>;

interface ConsentFormProps {
  onSubmit: (data: ConsentFormData) => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({ onSubmit }) => {
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      signature: '',
    },
  });

  const [isSignatureModalVisible, setSignatureModalVisible] = useState(false);

  const handleSignatureOK = (sig: string) => {
    setValue('signature', sig);
    setSignatureModalVisible(false);
  };

  const handleSignatureCancel = () => {
    setSignatureModalVisible(false);
  };

  const onFormSubmit: SubmitHandler<ConsentFormData> = (data) => {
    // Processa diretamente, sem exibir Alert para formulários incompletos
    onSubmit(data);
  };

  const signatureExists = Boolean(getValues('signature'));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termo de Consentimento</Text>

      <ScrollView
        style={styles.consentScrollView}
        contentContainerStyle={styles.consentContent}
      >
        <Text style={styles.consentText}>{consentText}</Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title={signatureExists ? 'Assinar novamente' : 'Assinar'}
          onPress={() => setSignatureModalVisible(true)}
        />
        {signatureExists && (
          <Button
            title="Concluir"
            onPress={handleSubmit(onFormSubmit)}
            style={[styles.reviewButton]}
            children={<></>}
          />
        )}
      </View>

      {errors.signature && (
        <Text style={styles.errorText}>{errors.signature.message}</Text>
      )}


      <SignatureModal
        visible={isSignatureModalVisible}
        onOK={handleSignatureOK}
        onCancel={handleSignatureCancel}
      />
    </View>
  );
};

export default ConsentForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  consentScrollView: {
    flex: 1,
    marginBottom: 16,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
  signaturePreview: {
    textAlign: 'center',
    fontSize: 16,
    color: 'green',
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  reviewButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
