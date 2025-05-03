import { Text, View, Image } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { userBasicInfoStyles as styles } from './styles';

const UserBasicInfo = ({userInfo}) => {
  if(userInfo === null || userInfo === undefined || (userInfo?.status === 'FAILED')){
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={40} color="#d32f2f" style={styles.errorIcon} />
        <Text style={styles.errorText}>Invalid Username</Text>
        <Text style={styles.errorSubText}>
          We couldn't find this user on Codeforces. Please check the username and try again.
        </Text>
      </View>
    );
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
      
      <View style={styles.infoContainer}>
        {userInfo?.result[0]?.handle && <Text>Username: {userInfo?.result[0]?.handle}</Text>}
        {userInfo?.result[0]?.firstName && <Text>Name: {userInfo?.result[0]?.firstName} {userInfo?.result[0]?.lastName}</Text>}
      </View>
    </View>
  )
}

export default UserBasicInfo