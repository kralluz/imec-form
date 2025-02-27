import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { TextStyles } from '../../constants/Typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoText: {
    ...TextStyles.heading2,
    color: Colors.primary,
  },
  infoContainer: {
    backgroundColor: Colors.gray[100],
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    ...TextStyles.bodySmall,
    fontWeight: '600',
    marginRight: 4,
  },
  infoValue: {
    ...TextStyles.bodySmall,
  },
});