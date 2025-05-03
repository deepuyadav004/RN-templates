import { ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import RatingCard from '@/components/ratingCard'

const index = () => {
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
        {/* Move everything inside a single ScrollView */}
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.mainScrollContainer}
          contentContainerStyle={styles.mainScrollContentContainer}
        >
          {/* Header content */}
          <View style={styles.contentContainer}>
            <Text style={styles.welcomeText}>Welcome to Coding Stats</Text>
            <Text style={styles.subText}>Here are your current platform ratings</Text>
          </View>

          {/* Rating Cards */}
          <RatingCard {...ratingsData.codeforces} />
          <RatingCard {...ratingsData.leetcode} />
          <RatingCard {...ratingsData.codechef} />
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  backgroundImage: {
    flex: 1,
  },
  mainScrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  mainScrollContentContainer: {
    paddingBottom: 20,
    alignItems: 'center'
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
    marginBottom: 10
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    marginBottom: 10
  },
  subText: {
    fontSize: 18,
    fontFamily: 'Gudea-Regular',
    color: Colors.WHITE,
    textAlign: 'center',
    marginBottom: 10
  },
  cardsOuterContainer: {
    height: 230, // Fixed container height
    marginBottom: 20,
  },
  cardsContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  cardsContentContainer: {
    paddingBottom: 20,
    alignItems: 'center'
  }
})