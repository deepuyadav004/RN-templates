import { 
  ScrollView, 
  View, 
  ImageBackground, 
  ActivityIndicator, 
  Text,
  Alert
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { homeStyles } from './styles'
import UserInfoForm from '@/components/forms/UserInfoForm'
import PlatformCards from '@/components/cards/PlatformCards'
import EditUserModal from '@/components/modals/EditUserModal'
import usePlatformService from '@/hooks/usePlatformService'
import useUserPreferences from '@/hooks/useUserPreferences'
import { RatingsData } from '@/types/platform-interfaces'

const index = () => {
  const [loading, setLoading] = useState(true)
  const [editModalVisible, setEditModalVisible] = useState(false)
  
  const platformService = usePlatformService()
  const userPreferences = useUserPreferences()
  
  // Initialize app on first load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const usernames = await userPreferences.loadUsernames()
        if (usernames) {
          // Set usernames in ratings data
          platformService.setRatingsData(prev => ({
            codeforces: {
              ...prev.codeforces,
              username: usernames.codeforces,
            },
            leetcode: {
              ...prev.leetcode,
              username: usernames.leetcode,
            },
            codechef: {
              ...prev.codechef,
              username: usernames.codechef,
            }
          }))
          
          // Fetch data for all platforms
          const cfSuccess = await platformService.updateCodeforcesData(usernames.codeforces)
          const lcSuccess = await platformService.updateLeetcodeData(usernames.leetcode)
          const ccSuccess = await platformService.updateCodechefData(usernames.codechef)
          
          // If any platform data fetch failed, use default data
          if (!cfSuccess || !lcSuccess || !ccSuccess) {
            platformService.setDefaultPlatformData()
          }
          
          userPreferences.setUsernamesSet(true)
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeApp()
  }, [])

  // Initialize edit modal when it becomes visible
  useEffect(() => {
    if (editModalVisible && userPreferences.usernamesSet) {
      const { codeforces, leetcode, codechef } = platformService.ratingsData
      userPreferences.initializeEditUsernames(
        codeforces.username,
        leetcode.username,
        codechef.username
      )
    }
  }, [editModalVisible])

  const handleSaveUsernames = async () => {
    const { codeforcesUsername, leetcodeUsername, codechefUsername } = userPreferences
    
    if (!codeforcesUsername || !leetcodeUsername || !codechefUsername) {
      Alert.alert("Missing Information", "Please enter usernames for all platforms.")
      return
    }
    
    try {
      setLoading(true)
      
      // Save usernames to storage
      const usernames = await userPreferences.saveUsernames(
        codeforcesUsername, 
        leetcodeUsername, 
        codechefUsername
      )
      
      // Update platform data
      await platformService.updateCodeforcesData(usernames.codeforces)
      await platformService.updateLeetcodeData(usernames.leetcode)
      await platformService.updateCodechefData(usernames.codechef)
      
      userPreferences.setUsernamesSet(true)
    } catch (error) {
      console.error('Error saving usernames:', error)
      Alert.alert("Error", "Failed to save usernames. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUsernames = async () => {
    const { editCodeforcesUsername, editLeetcodeUsername, editCodechefUsername } = userPreferences
    
    if (!editCodeforcesUsername || !editLeetcodeUsername || !editCodechefUsername) {
      Alert.alert("Missing Information", "Please enter usernames for all platforms.")
      return
    }
    
    try {
      setLoading(true)
      
      // Save updated usernames to storage
      const usernames = await userPreferences.saveUsernames(
        editCodeforcesUsername, 
        editLeetcodeUsername, 
        editCodechefUsername
      )
      
      // Update platform data
      await platformService.updateCodeforcesData(usernames.codeforces)
      await platformService.updateLeetcodeData(usernames.leetcode)
      await platformService.updateCodechefData(usernames.codechef)
      
      setEditModalVisible(false)
      Alert.alert("Success", "Your usernames have been updated successfully.")
    } catch (error) {
      console.error('Error updating usernames:', error)
      Alert.alert("Error", "Failed to update usernames. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={homeStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={homeStyles.loadingText}>Loading your profile...</Text>
      </View>
    )
  }

  return (
    <View style={homeStyles.container}>
      <ImageBackground
        source={require('../../../assets/images/bgCfSection.png')}
        style={homeStyles.backgroundImage}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={homeStyles.mainScrollContainer}
          contentContainerStyle={homeStyles.mainScrollContentContainer}
        >
          {userPreferences.usernamesSet ? (
            <PlatformCards 
              ratingsData={platformService.ratingsData} 
              onEditPress={() => setEditModalVisible(true)}
            />
          ) : (
            <UserInfoForm
              codeforcesUsername={userPreferences.codeforcesUsername}
              setCodeforcesUsername={userPreferences.setCodeforcesUsername}
              leetcodeUsername={userPreferences.leetcodeUsername}
              setLeetcodeUsername={userPreferences.setLeetcodeUsername}
              codechefUsername={userPreferences.codechefUsername}
              setCodechefUsername={userPreferences.setCodechefUsername}
              onSubmit={handleSaveUsernames}
            />
          )}
        </ScrollView>

        <EditUserModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          codeforcesUsername={userPreferences.editCodeforcesUsername}
          setCodeforcesUsername={userPreferences.setEditCodeforcesUsername}
          leetcodeUsername={userPreferences.editLeetcodeUsername}
          setLeetcodeUsername={userPreferences.setEditLeetcodeUsername}
          codechefUsername={userPreferences.editCodechefUsername}
          setCodechefUsername={userPreferences.setEditCodechefUsername}
          onSubmit={handleUpdateUsernames}
        />
      </ImageBackground>
    </View>
  )
}

export default index