// app/technicians.tsx
import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { PDFDataContext } from './context/PDFDataContext';

export default function TechnicianSelectionScreen() {
  const { setPDFData } = useContext(PDFDataContext)!;

  // Dropdown de Radiologia
  const [openRadiology, setOpenRadiology] = useState(false);
  const [valueRadiology, setValueRadiology] = useState(null);
  const [radiologyItems, setRadiologyItems] = useState([
    { label: 'Alisson (CRTR-12345)', value: 'rad1' },
    { label: 'Lando Inácio (CRTR-67890)', value: 'rad2' },
  ]);

  // Dropdown de Enfermagem
  const [openNursing, setOpenNursing] = useState(false);
  const [valueNursing, setValueNursing] = useState(null);
  const [nursingItems, setNursingItems] = useState([
    { label: 'Ana Silva (COREN-54321)', value: 'nurse1' },
    { label: 'Beatriz Souza (COREN-98765)', value: 'nurse2' },
  ]);

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

  // Efeito de escala no botão
  const scaleValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Selecione os Profissionais</Text>

      <Text style={styles.label}>Técnico de Radiologia</Text>
      <DropDownPicker
        open={openRadiology}
        value={valueRadiology}
        items={radiologyItems}
        setOpen={setOpenRadiology}
        setValue={setValueRadiology}
        setItems={setRadiologyItems}
        placeholder="Selecione um técnico"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
      />

      <View style={styles.divider} />

      <Text style={styles.label}>Técnica de Enfermagem</Text>
      <DropDownPicker
        open={openNursing}
        value={valueNursing}
        items={nursingItems}
        setOpen={setOpenNursing}
        setValue={setValueNursing}
        setItems={setNursingItems}
        placeholder="Selecione uma técnica"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
      />

      <Animated.View
        style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}
      >
        <TouchableOpacity
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handleProceed}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Prosseguir</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    ...TextStyles.body,
    marginBottom: 8,
    color: '#333',
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 1000, 
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray[300],
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 3,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray[300],
    borderWidth: 1,
    borderRadius: 12,
  },
  arrowIcon: {
    tintColor: Colors.primary || '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[300],
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 40,
    backgroundColor: Colors.primary || '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    ...TextStyles.body,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
