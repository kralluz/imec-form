// app/technicians.tsx
import React, { useContext, useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  View,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { PDFDataContext } from './context/PDFDataContext';
import Header from '@/components/Header';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TechnicianSelectionScreen() {
  const { setPDFData } = useContext(PDFDataContext)!;

  const [valueRadiology, setValueRadiology] = useState<any>(null);
  const [radiologyItems] = useState([
    { label: 'Alisson (CRTR-12345)', value: 'rad1' },
    { label: 'Lando Inácio (CRTR-67890)', value: 'rad2' },
  ]);
  const [isRadiologyModalVisible, setRadiologyModalVisible] = useState(false);

  const [valueNursing, setValueNursing] = useState<any>(null);
  const [nursingItems] = useState([
    { label: 'Ana Silva (COREN-54321)', value: 'nurse1' },
    { label: 'Beatriz Souza (COREN-98765)', value: 'nurse2' },
  ]);
  const [isNursingModalVisible, setNursingModalVisible] = useState(false);

  const handleProceed = () => {
    if (valueRadiology && valueNursing) {
      const radiologyTech = radiologyItems.find(
        (item) => item.value === valueRadiology
      );
      const nursingTech = nursingItems.find(
        (item) => item.value === valueNursing
      );
      setPDFData((prev) => ({
        ...prev,
        radiologyTechnician: radiologyTech,
        nursingTechnician: nursingTech,
      }));
      router.push('/questionnaires' as any);
    }
  };

  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 20,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  const renderModal = (
    visible: boolean,
    items: { label: string; value: string }[],
    onSelect: (value: string) => void,
    onClose: () => void,
    title: string
  ) => (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{title}</Text>
              <ScrollView style={styles.modalContent}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.modalItem}
                    onPress={() => {
                      onSelect(item.value);
                      onClose();
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Define a cor do botão com base na seleção dos técnicos
  const isButtonEnabled = valueRadiology && valueNursing;
  const buttonBackgroundColor = isButtonEnabled
    ? 'rgb(69, 152, 241)'
    : Colors.gray[300];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          Selecione os profissionais responsáveis
        </Text>

        <Text style={styles.label}>Técnico de Radiologia</Text>
        <TouchableOpacity
          style={styles.selectionField}
          onPress={() => setRadiologyModalVisible(true)}
        >
          <Text
            style={
              valueRadiology ? styles.selectedText : styles.placeholderText
            }
          >
            {valueRadiology
              ? radiologyItems.find((item) => item.value === valueRadiology)
                  ?.label
              : 'Selecione um técnico'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Técnica de Enfermagem</Text>
        <TouchableOpacity
          style={styles.selectionField}
          onPress={() => setNursingModalVisible(true)}
        >
          <Text
            style={valueNursing ? styles.selectedText : styles.placeholderText}
          >
            {valueNursing
              ? nursingItems.find((item) => item.value === valueNursing)?.label
              : 'Selecione uma técnica'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <AnimatedTouchable
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleValue }],
            backgroundColor: buttonBackgroundColor,
          },
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handleProceed}
        activeOpacity={0.8}
        disabled={!isButtonEnabled}
      >
        <Text style={styles.buttonText}>Prosseguir</Text>
      </AnimatedTouchable>

      {renderModal(
        isRadiologyModalVisible,
        radiologyItems,
        setValueRadiology,
        () => setRadiologyModalVisible(false),
        'Selecione o Técnico de Radiologia'
      )}

      {renderModal(
        isNursingModalVisible,
        nursingItems,
        setValueNursing,
        () => setNursingModalVisible(false),
        'Selecione a Técnica de Enfermagem'
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    ...TextStyles.body,
    marginBottom: 8,
    color: '#333',
  },
  selectionField: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  placeholderText: {
    ...TextStyles.body,
    color: Colors.gray[500] || '#999',
  },
  selectedText: {
    ...TextStyles.body,
    color: '#333',
  },
  buttonContainer: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    ...TextStyles.body,
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    ...TextStyles.heading4,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 15,
  },
  modalItem: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  modalItemText: {
    ...TextStyles.body,
    color: '#333',
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    ...TextStyles.body,
    color: 'rgb(69, 152, 241)',
    fontWeight: 'bold',
  },
});
