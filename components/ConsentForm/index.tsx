import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { styles } from './styles';
import { consentText } from '../../data/consentText';
import Footer from '../Footer';
import Button from '../Button';
import SignatureModal from '../SignatureModal';

export const consentSchema = z.object({
  cpf: z
    .string()
    .nonempty('CPF é obrigatório'),
  rg: z.string().nonempty('RG é obrigatório'),
  birthDate: z
    .string()
    .nonempty('Data de Nascimento é obrigatória'),
  signature: z.string().nonempty('Assinatura é obrigatória'),
});

export type ConsentFormData = z.infer<typeof consentSchema>;

interface ConsentFormProps {
  onSubmit: (data: ConsentFormData) => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      cpf: '',
      rg: '',
      birthDate: '',
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
    if (!data.signature) {
      Alert.alert(
        'Formulário incompleto',
        'Por favor, preencha todos os campos e assine o termo de consentimento.'
      );
      return;
    }
    onSubmit(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termo de Consentimento</Text>

      <ScrollView style={styles.consentTextContainer}>
        <Text style={styles.consentText}>{consentText}</Text>
      </ScrollView>

      <Button
        title={getValues('signature') ? 'Reassinar' : 'Assinar'}
        onPress={() => setSignatureModalVisible(true)}
      />

      {errors.signature && (
        <Text style={styles.errorText}>{errors.signature.message}</Text>
      )}

      {getValues('signature') ? (
        <Text style={styles.signaturePreview}>Assinatura capturada</Text>
      ) : null}

      <Footer control={control} errors={errors} />

      <View style={styles.buttonContainer}>
        <Button title="Confirmar e Enviar" onPress={handleSubmit(onFormSubmit)} />
      </View>

      <SignatureModal
        visible={isSignatureModalVisible}
        onOK={handleSignatureOK}
        onCancel={handleSignatureCancel}
      />
    </View>
  );
};

export default ConsentForm;
