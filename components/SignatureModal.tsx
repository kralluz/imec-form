import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { styles } from './styles';
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

export default SignatureModal;
