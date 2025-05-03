import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export const userBasicInfoStyles = StyleSheet.create({
    imgStyle: {
        width: 200,
        height: 200
    },
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 8,
    },
    infoContainer: {
        padding: 10,
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    titleTxt: {
      fontSize: width*0.08,
      fontFamily: 'Gudea-Bold',
      color: Colors.LIGHT_GOLD
    },
    ratingTxt: {
      fontSize: width*0.05,
      fontFamily: 'Gudea-Italic',
      color: Colors.WHITE,
      paddingBottom: 8
    },
    errorContainer: {
      width: '90%',
      backgroundColor: 'rgba(255, 200, 200, 0.9)',
      borderRadius: 10,
      padding: 20,
      marginTop: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ffaaaa',
    },
    errorText: {
      color: '#d32f2f',
      fontSize: 16,
      fontFamily: 'Gudea-Bold',
      textAlign: 'center',
    },
    errorSubText: {
      color: '#d32f2f',
      fontSize: 14,
      fontFamily: 'Gudea-Regular',
      marginTop: 8,
      textAlign: 'center',
    },
    errorIcon: {
      marginBottom: 10,
    }
});
