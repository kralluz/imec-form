import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  questionText: {
    ...TextStyles.subtitle,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    padding: 12,
    ...TextStyles.body,
  },
  textareaInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    padding: 12,
    minHeight: 100,
    ...TextStyles.body,
  },
  optionsContainer: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioOuterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxOuterSquare: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxInnerSquare: {
    height: 12,
    width: 12,
    backgroundColor: Colors.primary,
  },
  optionLabel: {
    ...TextStyles.body,
  },
  conditionalContainer: {
    marginTop: 12,
    marginLeft: 24,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: Colors.gray[300],
  },
});