import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import getUserInfo from '@/api/codeforcesApis/getUserInfoByHandle';
import UserBasicInfo from '@/components/cards/codeforcesCards/UserBasicInfo'

const Codeforces = () => {
  
  const userName = "xeroin";
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getUserInfo(userName).then((res) => setUserInfo(res));
      // console.log(userInfo?.result[0]?.titlePhoto)
    };

    fetchUserInfo();
  }, []);

  return (
    <ScrollView>
      {userInfo!=null &&  <UserBasicInfo userInfo={userInfo} /> }
     
    </ScrollView>
  )
}

export default Codeforces

const styles = StyleSheet.create({})