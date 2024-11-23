import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const UserBasicInfo = ({userInfo}) => {
  if(userInfo === null || userInfo === undefined || (userInfo?.status === 'FAILED')){
    return <Text>Failed to retrieve info</Text>
  }
  
  return (
    <View style={styles.container} >
      <View >
        <View>
        
        <View style={styles.titleContainer} >
          {userInfo?.result[0]?.rank && <Text>Title: {userInfo?.result[0]?.rank} </Text>}
          {userInfo?.result[0]?.maxRank && <Text>(max: {userInfo?.result[0]?.maxRank})</Text>}
        </View>

        <View style={styles.titleContainer} >
          {userInfo?.result[0]?.rating && <Text>Rating: {userInfo?.result[0]?.rating} </Text>}
          {userInfo?.result[0]?.maxRating && <Text>(max: {userInfo?.result[0]?.maxRating})</Text>}
        </View>
        
        </View>
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
        width: 250,
        height: 250
    },
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        // backgroundColor: 'black',
        // paddingTop: 16,
    },
    infoContainer: {

    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row'
    }
})