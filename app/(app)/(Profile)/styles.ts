import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

// Get screen width for nav indicator animations
const SCREEN_WIDTH = Dimensions.get('window').width;
export const TAB_WIDTH = SCREEN_WIDTH / 3;

export const profileStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  navBarContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    height: 50,
  },
  navTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  navTabText: {
    fontFamily: 'Gudea-Regular',
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  navTabTextActive: {
    fontFamily: 'Gudea-Bold',
    color: Colors.CORAL,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: TAB_WIDTH,
    height: 3,
    backgroundColor: Colors.CORAL,
    borderRadius: 3,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  platformContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  cardContainer: {
    width: '100%',
    marginVertical: 15,
    alignItems: 'center',
  },
  sectionTitleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  placeholderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 22,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Gudea-Italic',
    color: '#555',
    textAlign: 'center',
  },
  ratingCard: {
    width: '90%',
    alignSelf: 'center',
  },
});
