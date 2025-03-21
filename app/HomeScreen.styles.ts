// HomeScreen.styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { TextStyles } from '../constants/Typography';

const { width } = Dimensions.get('window');
const cardMargin = 10;
export const cardWidth = (width - cardMargin * 3) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 40,
    paddingHorizontal: cardMargin,
  },
  welcome: {
    ...TextStyles.heading3,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: cardMargin,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLogo: {
    width: cardWidth * 0.8,
    height: cardWidth * 0.8,
  },
  dottedCard: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  placeholderContainer: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...TextStyles.heading3,
    color: '#ccc',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...TextStyles.heading3,
    textAlign: 'center',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    ...TextStyles.heading3,
    marginBottom: 20,
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    paddingRight: 35,
    marginBottom: 15,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  clearButtonText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    ...TextStyles.body,
  },
});
