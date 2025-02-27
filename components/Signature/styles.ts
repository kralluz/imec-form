import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    ...TextStyles.subtitle,
    marginBottom: 8,
  },
  signatureContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    backgroundColor: Colors.gray[200],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  clearButtonText: {
    ...TextStyles.buttonSmall,
    color: Colors.gray[700],
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    ...TextStyles.buttonSmall,
    color: Colors.white,
  },
});