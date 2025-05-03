import { ScrollView, StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import RatingCard from '@/components/ratingCard'
import AsyncStorage from '@react-native-async-storage/async-storage'

const USERNAMES_STORAGE_KEY = 'platform_usernames'

const index = () => {
  // State for tracking if usernames are set
  const [usernamesSet, setUsernamesSet] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Form state for usernames
  const [codeforcesUsername, setCodeforcesUsername] = useState('')
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [codechefUsername, setCodechefUsername] = useState('')
  
  // Sample data for rating cards (will be replaced with real data later)
  const [ratingsData, setRatingsData] = useState({
    codeforces: {
      platformName: "Codeforces",
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: '#E9F5FE',
      textColor: '#4285F4',
      logoUri: "https://codeforces.org/s/0/favicon-32x32.png"
    },
    leetcode: {
      platformName: "LeetCode",
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: '#FFF4E6',
      textColor: '#FFA116',
      logoUri: "https://leetcode.com/static/images/LeetCode_logo_rvs.png"
    },
    codechef: {
      platformName: "CodeChef",
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: '#F1F8E9',
      textColor: '#7E8D64',
      logoUri: "https://cdn.codechef.com/images/cc-logo.svg"
    }
  })

  // Check if usernames are already set
  useEffect(() => {
    const checkUsernames = async () => {
      try {
        const storedUsernames = await AsyncStorage.getItem(USERNAMES_STORAGE_KEY)
        if (storedUsernames) {
          const usernames = JSON.parse(storedUsernames)
          
          // Update the ratings data with stored usernames
          setRatingsData(prev => ({
            codeforces: {
              ...prev.codeforces,
              username: usernames.codeforces,
              rating: 1432, // Sample data, would be fetched from API
              maxRating: 1523,
              rank: "Specialist"
            },
            leetcode: {
              ...prev.leetcode,
              username: usernames.leetcode,
              rating: 1845,
              maxRating: 1910,
              rank: "Guardian"
            },
            codechef: {
              ...prev.codechef,
              username: usernames.codechef,
              rating: 1692,
              maxRating: 1720,
              rank: "3★"
            }
          }))
          
          setUsernamesSet(true)
        }
      } catch (error) {
        console.error('Error loading usernames:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkUsernames()
  }, [])

  // Save usernames and set the state
  const handleSaveUsernames = async () => {
    if (!codeforcesUsername || !leetcodeUsername || !codechefUsername) {
      Alert.alert("Missing Information", "Please enter usernames for all platforms.")
      return
    }
    
    try {
      setLoading(true)
      const usernames = {
        codeforces: codeforcesUsername,
        leetcode: leetcodeUsername,
        codechef: codechefUsername
      }
      
      await AsyncStorage.setItem(USERNAMES_STORAGE_KEY, JSON.stringify(usernames))
      
      // Update the ratings data with the new usernames
      setRatingsData(prev => ({
        codeforces: {
          ...prev.codeforces,
          username: usernames.codeforces,
          rating: 1432, // Sample data, would be fetched from API
          maxRating: 1523,
          rank: "Specialist"
        },
        leetcode: {
          ...prev.leetcode,
          username: usernames.leetcode,
          rating: 1845,
          maxRating: 1910,
          rank: "Guardian"
        },
        codechef: {
          ...prev.codechef,
          username: usernames.codechef,
          rating: 1692,
          maxRating: 1720,
          rank: "3★"
        }
      }))
      
      setUsernamesSet(true)
    } catch (error) {
      console.error('Error saving usernames:', error)
      Alert.alert("Error", "Failed to save usernames. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={styles.backgroundImage}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.mainScrollContainer}
          contentContainerStyle={styles.mainScrollContentContainer}
        >
          {usernamesSet ? (
            // Content when usernames are set
            <>
              <View style={styles.contentContainer}>
                <Text style={styles.welcomeText}>Welcome to Coding Stats</Text>
                <View style={styles.divider} />
                <Text style={styles.subText}>Your platform ratings at a glance</Text>
              </View>

              <View style={styles.cardContainer}>
                <RatingCard {...ratingsData.codeforces} />
              </View>
              <View style={styles.cardContainer}>
                <RatingCard {...ratingsData.leetcode} />
              </View>
              <View style={styles.cardContainer}>
                <RatingCard {...ratingsData.codechef} />
              </View>
            </>
          ) : (
            // Form when usernames need to be collected
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Welcome to Coding Stats!</Text>
              <Text style={styles.formSubtitle}>
                Please enter your usernames for the following platforms to get started.
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Codeforces Username</Text>
                <TextInput
                  style={styles.input}
                  value={codeforcesUsername}
                  onChangeText={setCodeforcesUsername}
                  placeholder="Enter your Codeforces username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>LeetCode Username</Text>
                <TextInput
                  style={styles.input}
                  value={leetcodeUsername}
                  onChangeText={setLeetcodeUsername}
                  placeholder="Enter your LeetCode username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>CodeChef Username</Text>
                <TextInput
                  style={styles.input}
                  value={codechefUsername}
                  onChangeText={setCodechefUsername}
                  placeholder="Enter your CodeChef username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveUsernames}>
                <Text style={styles.saveButtonText}>Save & Continue</Text>
              </TouchableOpacity>
            </View>
          )}
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
    paddingHorizontal: 16,
  },
  mainScrollContentContainer: {
    paddingBottom: 90, // Extra padding to account for tab bar
    alignItems: 'center'
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
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
    marginBottom: 15,
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
    borderRadius: 15,
    padding: 20,
    marginTop: 50,
    marginBottom: 20,
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
    marginBottom: 20,
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
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'Gudea-Bold',
  },
})