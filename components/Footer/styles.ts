import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    marginTop: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    ...TextStyles.bodySmall,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 4,
    padding: 8,
    ...TextStyles.body,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    ...TextStyles.bodySmall,
    color: "red",
    marginTop: 4,
  },
});
