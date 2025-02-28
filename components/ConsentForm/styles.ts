import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors'; // Certifique-se de ter este arquivo

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff', // Exemplo
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  consentTextContainer: {
    height: 200, // Ajuste a altura conforme necessário
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
  },
  consentText: {
    fontSize: 14, // Ajuste conforme necessário
  },
  signatureButton: {
    backgroundColor: Colors.primary, // Use suas cores
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signatureButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  signaturePreview: {
    marginBottom: 16,
    textAlign: 'center',
    color: 'green',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  // Outros estilos que você possa ter...
});
