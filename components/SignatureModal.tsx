
// components/SignatureModal.tsx (Mesmo código que você forneceu, com pequenas adaptações)

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import Colors from '@/constants/Colors';
import { TextStyles } from '@/constants/Typography';


interface SignatureModalProps {
  visible: boolean;
  onOK: (signature: string) => void;
  onCancel: () => void;
}
const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  onOK,
  onCancel,
}) => {
  const signatureRef = useRef<any>(null);
  const webStyle = `
    .m-signature-pad--footer { display: none; margin: 0px; }
    body,html { height: 100%; margin: 0; background-color: #fff; }
    canvas { background-color: #fff; }
  `;
  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };
  const handleSave = () => {
    signatureRef.current?.readSignature();
  };
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <SignatureScreen
          ref={signatureRef}
          onOK={onOK}
          onEmpty={() => {}}
          descriptionText=""
          webStyle={webStyle}
          autoClear={true}
          clearText=""
          confirmText=""
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleClear}>
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 20

    },
    button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
        paddingHorizontal: 20,
     borderRadius: 8,
  },
      buttonText: {
    ...TextStyles.body,
    color: Colors.white,
  },

})

export default SignatureModal;
