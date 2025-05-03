import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ImageBackground  } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors'
import { Stack } from 'expo-router'
import Codechef from '@/components/codechef/Codechef'
import Codeforces from '@/components/codeforces/Codeforces'
import Leetcode from '@/components/leetcode/Leetcode'
import RatingCard from '@/components/ratingCard'

const index = () => {

  const [headerValue, setHeaderValue] = useState("Codeforces")

  // Sample data for rating cards
  const ratingsData = {
    codeforces: {
      platformName: "Codeforces",
      rating: 1432,
      username: "xeroin",
      maxRating: 1523,
      rank: "Specialist",
      backgroundColor: '#E9F5FE',
      textColor: '#4285F4',
      logoUri: "https://codeforces.org/s/0/favicon-32x32.png"
    },
    leetcode: {
      platformName: "LeetCode",
      rating: 1845,
      username: "coder123",
      maxRating: 1910,
      rank: "Guardian",
      backgroundColor: '#FFF4E6',
      textColor: '#FFA116',
      logoUri: "https://leetcode.com/static/images/LeetCode_logo_rvs.png"
    },
    codechef: {
      platformName: "CodeChef",
      rating: 1692,
      username: "chef_coder",
      maxRating: 1720,
      rank: "3★",
      backgroundColor: '#F1F8E9',
      textColor: '#7E8D64',
      logoUri: "https://cdn.codechef.com/images/cc-logo.svg"
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.headerContainer} >
          <TouchableOpacity style={ headerValue==="Codeforces" ? styles.btnSelected : styles.btnNotSelected} onPress={() => setHeaderValue("Codeforces")} >
            <Text style={ headerValue==="Codeforces" ? styles.txtSelected : styles.txtNotSelected } >Codeforces</Text>
          </TouchableOpacity>

          <TouchableOpacity style={ headerValue==="Leetcode" ? styles.btnSelected : styles.btnNotSelected} onPress={()=>setHeaderValue("Leetcode")} >
            <Text style={ headerValue==="Leetcode" ? styles.txtSelected : styles.txtNotSelected } >Leetcode</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={ headerValue==="Codechef" ? styles.btnSelected : styles.btnNotSelected} onPress={() => setHeaderValue("Codechef")} >
            <Text style={ headerValue==="Codechef" ? styles.txtSelected : styles.txtNotSelected } >Codechef</Text>
          </TouchableOpacity>
        </View>

        {/* Rating Cards Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
          <RatingCard {...ratingsData.codeforces} />
          <RatingCard {...ratingsData.leetcode} />
          <RatingCard {...ratingsData.codechef} />
        </ScrollView>

        <View>
        {
          headerValue === "Codeforces" ? <Codeforces /> : (
            headerValue === "Leetcode" ? <Leetcode /> : <Codechef />
          )
        }
        </View>
      </ImageBackground>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  cardsContainer: {
    paddingVertical: 15,
    marginBottom: 10,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40
  },
  btnSelected: {
    backgroundColor: Colors.CORAL,
    padding: 8,
    borderRadius: 20,
    margin: 8,
    width: 95,
    alignItems: 'center'
  },
  txtSelected: {
    color: Colors.WHITE,
    // fontWeight: 'bold',
    fontFamily: 'Gudea-Bold'
  },
  btnNotSelected: {
    padding: 8,
    borderRadius: 20,
    margin: 8,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    width: 95,
    alignItems: 'center'
  },
  txtNotSelected: {
    // fontWeight: 'bold',
    fontFamily: 'Gudea-Italic'
  },
  container: {
    width: '100%',
    height: '100%'
  },
  backgroundImage: {
    flex: 1,
  },
})