import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const UserBasicInfo = ({userInfo}) => {
  return (
    <View style={styles.container} >
      <View >
        <Image 
            source={{uri: userInfo.result[0].titlePhoto}}
            resizeMode = 'stretch'
            style={styles.imgStyle}
        />
      </View>
      
      <View className='infoContainer'>
        {userInfo?.result[0]?.handle && <Text>Username: {userInfo?.result[0]?.handle}</Text>}

        {userInfo?.result[0]?.firstName && <Text>Name: {userInfo?.result[0]?.firstName} {userInfo?.result[0]?.lastName}</Text>}
        
        {userInfo?.result[0]?.maxRank && <Text>Best title: {userInfo?.result[0]?.maxRank}</Text>}

        {userInfo?.result[0]?.rank && <Text>Current title: {userInfo?.result[0]?.rank}</Text>}

        {userInfo?.result[0]?.maxRating && <Text>Max rating: {userInfo?.result[0]?.maxRating}</Text>}

        {userInfo?.result[0]?.rating && <Text>Current rating: {userInfo?.result[0]?.rating}</Text>}
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

    }
})