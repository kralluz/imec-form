import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...TextStyles.heading2,
    marginBottom: 16,
    textAlign: 'center',
  },
  consentTextContainer: {
    backgroundColor: Colors.gray[100],
    padding: 16,
    borderRadius: 8,
    maxHeight: 200,
    marginBottom: 16,
  },
  consentText: {
    ...TextStyles.body,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  signatureButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 10,
  },
  signatureButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilo para exibir uma mensagem após a assinatura
  signaturePreview: {
    textAlign: 'center',
    fontSize: 14,
    color: '#4CAF50',
    marginVertical: 8,
  },
});
