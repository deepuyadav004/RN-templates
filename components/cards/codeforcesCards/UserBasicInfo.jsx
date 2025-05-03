import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const UserBasicInfo = ({userInfo}) => {
  if(userInfo === null || userInfo === undefined || (userInfo?.status === 'FAILED')){
    return <Text>Failed to retrieve info</Text>
  }
  
  return (
    <View style={styles.container} >
      <View >
        <View>
        
        <View>
          <View style={styles.titleContainer} >
            {userInfo?.result[0]?.rank && <Text style={styles.titleTxt} > {userInfo?.result[0]?.rank} </Text>}
            {userInfo?.result[0]?.maxRank && <Text style={styles.titleTxt} >(max: {userInfo?.result[0]?.maxRank})</Text>}
          </View>

          <View style={[styles.titleContainer, {paddingTop: 4, paddingLeft: 10}]} >
            {userInfo?.result[0]?.rating && <Text style={styles.ratingTxt} >Rating: {userInfo?.result[0]?.rating} </Text>}
            {userInfo?.result[0]?.maxRating && <Text style={styles.ratingTxt} >(max: {userInfo?.result[0]?.maxRating})</Text>}
          </View>
        </View>
        
        </View>
        
      </View>

      <View>

      <Image 
            source={{uri: userInfo.result[0].titlePhoto}}
            resizeMode = 'stretch'
            style={styles.imgStyle}
      />

      </View>
      
      <View className='infoContainer'>
        {userInfo?.result[0]?.handle && <Text>Username: {userInfo?.result[0]?.handle}</Text>}

        {userInfo?.result[0]?.firstName && <Text>Name: {userInfo?.result[0]?.firstName} {userInfo?.result[0]?.lastName}</Text>}
        
      </View>
    </View>
  )
}

export default UserBasicInfo

const styles = StyleSheet.create({
    imgStyle: {
        width: 200,
        height: 200
    },
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        // backgroundColor: 'black',
        paddingTop: 8,
    },
    infoContainer: {

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
    }
})