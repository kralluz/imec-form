import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { consentText } from '../../data/consentText';
import Footer from '../Footer';
import Button from '../Button';
import SignatureModal from '../SignatureModal';

interface ConsentFormProps {
  signature: string;
  setSignature: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  rg: string;
  setRg: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  onSubmit: () => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({
  signature,
  setSignature,
  cpf,
  setCpf,
  rg,
  setRg,
  birthDate,
  setBirthDate,
  onSubmit,
}) => {
  const [isSignatureModalVisible, setSignatureModalVisible] = useState(false);

  const handleSignatureOK = (sig: string) => {
    setSignature(sig);
    setSignatureModalVisible(false);
  };

  const handleSignatureCancel = () => {
    setSignatureModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Termo de Consentimento</Text>

      <ScrollView style={styles.consentTextContainer}>
        <Text style={styles.consentText}>{consentText}</Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.signatureButton}
        onPress={() => setSignatureModalVisible(true)}
      >
        <Text style={styles.signatureButtonText}>
          {signature ? 'Reassinar' : 'Assinar'}
        </Text>
      </TouchableOpacity>

      {signature ? (
        <Text style={styles.signaturePreview}>Assinatura capturada</Text>
      ) : null}

      <Footer
        cpf={cpf}
        setCpf={setCpf}
        rg={rg}
        setRg={setRg}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Confirmar e Enviar"
          onPress={onSubmit}
          disabled={!signature || !cpf || !rg || !birthDate}
        />
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
