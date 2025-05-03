import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { UI } from '@/constants/AppConstants';

export const homeStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  backgroundImage: {
    flex: 1,
  },
  mainScrollContainer: {
    flex: 1,
    paddingHorizontal: UI.PADDING.HORIZONTAL,
  },
  mainScrollContentContainer: {
    paddingBottom: UI.BOTTOM_PADDING,
    alignItems: 'center'
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI.PADDING.VERTICAL,
    marginTop: UI.MARGIN.TOP,
    marginBottom: UI.MARGIN.BOTTOM,
    backgroundColor: `rgba(0,0,0,${UI.CONTAINER_OPACITY})`,
    borderRadius: UI.BORDER_RADIUS.CARD,
    paddingVertical: 25,
  },
  welcomeText: {
    fontSize: 30,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  divider: {
    height: 2,
    width: 60,
    backgroundColor: Colors.CORAL,
    marginBottom: 15,
    borderRadius: 2,
  },
  subText: {
    fontSize: 18,
    fontFamily: 'Gudea-Regular',
    color: Colors.WHITE,
    textAlign: 'center',
    opacity: 0.9,
  },
  cardContainer: {
    width: '100%',
    marginBottom: UI.MARGIN.BOTTOM,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Gudea-Regular',
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: UI.BORDER_RADIUS.CARD,
    padding: UI.PADDING.VERTICAL,
    marginTop: UI.MARGIN.TOP,
    marginBottom: UI.MARGIN.BOTTOM,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
    textAlign: 'center',
    marginBottom: 15,
  },
  formSubtitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: UI.MARGIN.BOTTOM,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Gudea-Regular',
  },
  saveButton: {
    backgroundColor: Colors.CORAL,
    borderRadius: UI.BORDER_RADIUS.BUTTON,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'Gudea-Bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 15,
  },
  editButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Gudea-Regular',
    fontSize: 14,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, ${UI.MODAL.BACKGROUND_OPACITY})`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: UI.BORDER_RADIUS.CARD,
    padding: UI.PADDING.VERTICAL,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI.PADDING.HORIZONTAL,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
  },
  closeButton: {
    padding: 5,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontFamily: 'Gudea-Bold',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: Colors.CORAL,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: UI.BORDER_RADIUS.BUTTON,
  },
  updateButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Gudea-Bold',
    fontSize: 16,
  },
});
