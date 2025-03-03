import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    alignItems: 'flex-start',
  },
  logo: {
    width: 160,
    height: 60,
  },
});
