import { 
  ScrollView, 
  View, 
  ImageBackground, 
  ActivityIndicator, 
  Text,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS, PLATFORM_DATA, UI, SAMPLE_DATA, API } from '@/constants/AppConstants'
import { Feather } from '@expo/vector-icons'
import { homeStyles } from './styles'
import UserInfoForm from '@/components/forms/UserInfoForm'
import PlatformCards from '@/components/cards/PlatformCards'

interface CodeforcesUserInfo {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  titlePhoto: string;
}

const index = () => {
  const [usernamesSet, setUsernamesSet] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [codeforcesUsername, setCodeforcesUsername] = useState('')
  const [leetcodeUsername, setLeetcodeUsername] = useState('')
  const [codechefUsername, setCodechefUsername] = useState('')
  
  const [ratingsData, setRatingsData] = useState({
    codeforces: {
      platformName: PLATFORM_DATA.CODEFORCES.PLATFORM_NAME,
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: PLATFORM_DATA.CODEFORCES.BACKGROUND_COLOR,
      textColor: PLATFORM_DATA.CODEFORCES.TEXT_COLOR,
      logoUri: PLATFORM_DATA.CODEFORCES.LOGO_URI,
      isError: false,
      errorMessage: ""
    },
    leetcode: {
      platformName: PLATFORM_DATA.LEETCODE.PLATFORM_NAME,
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: PLATFORM_DATA.LEETCODE.BACKGROUND_COLOR,
      textColor: PLATFORM_DATA.LEETCODE.TEXT_COLOR,
      logoUri: PLATFORM_DATA.LEETCODE.LOGO_URI
    },
    codechef: {
      platformName: PLATFORM_DATA.CODECHEF.PLATFORM_NAME,
      rating: 0,
      username: "",
      maxRating: 0,
      rank: "",
      backgroundColor: PLATFORM_DATA.CODECHEF.BACKGROUND_COLOR,
      textColor: PLATFORM_DATA.CODECHEF.TEXT_COLOR,
      logoUri: PLATFORM_DATA.CODECHEF.LOGO_URI
    }
  })

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCodeforcesUsername, setEditCodeforcesUsername] = useState('');
  const [editLeetcodeUsername, setEditLeetcodeUsername] = useState('');
  const [editCodechefUsername, setEditCodechefUsername] = useState('');

  const fetchCodeforcesUserInfo = async (username: string) => {
    try {
      const response = await fetch(`${API.CODEFORCES.USER_INFO}?handles=${username}`);
      const data = await response.json();
      
      if (data.status === "OK" && data.result.length > 0) {
        const userInfo = data.result[0];
        return {
          handle: userInfo.handle,
          rating: userInfo.rating || 0,
          maxRating: userInfo.maxRating || 0,
          rank: userInfo.rank || "",
          maxRank: userInfo.maxRank || "",
          titlePhoto: userInfo.titlePhoto || "",
        };
      }
      throw new Error("Failed to fetch Codeforces user info");
    } catch (error) {
      console.error("Error fetching Codeforces user info:", error);
      return null;
    }
  };
  
  const updateCodeforcesData = async (username: string) => {
    try {
      const userInfo = await fetchCodeforcesUserInfo(username);
      
      if (userInfo) {
        setRatingsData(prev => ({
          ...prev,
          codeforces: {
            ...prev.codeforces,
            username: userInfo.handle,
            rating: userInfo.rating,
            maxRating: userInfo.maxRating,
            rank: userInfo.rank.charAt(0).toUpperCase() + userInfo.rank.slice(1), // Capitalize first letter
            isError: false
          }
        }));
        return true;
      } else {
        // Handle invalid username case
        setRatingsData(prev => ({
          ...prev,
          codeforces: {
            ...prev.codeforces,
            username: username, // Keep the entered username to show in error card
            rating: 0,
            maxRating: 0,
            rank: "Invalid",
            isError: true,
            errorMessage: "Username not found on Codeforces"
          }
        }));
        return false;
      }
    } catch (error) {
      console.error("Error in updateCodeforcesData:", error);
      // Set error state with appropriate message
      setRatingsData(prev => ({
        ...prev,
        codeforces: {
          ...prev.codeforces,
          username: username,
          isError: true,
          errorMessage: "Failed to fetch Codeforces data. Please try again later."
        }
      }));
      return false;
    }
  };

  useEffect(() => {
    const checkUsernames = async () => {
      try {
        const storedUsernames = await AsyncStorage.getItem(STORAGE_KEYS.USERNAMES)
        if (storedUsernames) {
          const usernames = JSON.parse(storedUsernames)
          
          setRatingsData(prev => ({
            codeforces: {
              ...prev.codeforces,
              username: usernames.codeforces,
            },
            leetcode: {
              ...prev.leetcode,
              username: usernames.leetcode,
              rating: SAMPLE_DATA.LEETCODE.RATING,
              maxRating: SAMPLE_DATA.LEETCODE.MAX_RATING,
              rank: SAMPLE_DATA.LEETCODE.RANK
            },
            codechef: {
              ...prev.codechef,
              username: usernames.codechef,
              rating: SAMPLE_DATA.CODECHEF.RATING,
              maxRating: SAMPLE_DATA.CODECHEF.MAX_RATING,
              rank: SAMPLE_DATA.CODECHEF.RANK
            }
          }));
          
          const success = await updateCodeforcesData(usernames.codeforces);
          if (!success) {
            setRatingsData(prev => ({
              ...prev,
              codeforces: {
                ...prev.codeforces,
                rating: SAMPLE_DATA.CODEFORCES.RATING,
                maxRating: SAMPLE_DATA.CODEFORCES.MAX_RATING,
                rank: SAMPLE_DATA.CODEFORCES.RANK
              }
            }));
          }
          
          setUsernamesSet(true);
        }
      } catch (error) {
        console.error('Error loading usernames:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkUsernames()
  }, [])

  useEffect(() => {
    if (editModalVisible && usernamesSet) {
      setEditCodeforcesUsername(ratingsData.codeforces.username);
      setEditLeetcodeUsername(ratingsData.leetcode.username);
      setEditCodechefUsername(ratingsData.codechef.username);
    }
  }, [editModalVisible]);

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
      
      await AsyncStorage.setItem(STORAGE_KEYS.USERNAMES, JSON.stringify(usernames))
      
      setRatingsData(prev => ({
        codeforces: {
          ...prev.codeforces,
          username: usernames.codeforces,
        },
        leetcode: {
          ...prev.leetcode,
          username: usernames.leetcode,
          rating: SAMPLE_DATA.LEETCODE.RATING,
          maxRating: SAMPLE_DATA.LEETCODE.MAX_RATING,
          rank: SAMPLE_DATA.LEETCODE.RANK
        },
        codechef: {
          ...prev.codechef,
          username: usernames.codechef,
          rating: SAMPLE_DATA.CODECHEF.RATING,
          maxRating: SAMPLE_DATA.CODECHEF.MAX_RATING,
          rank: SAMPLE_DATA.CODECHEF.RANK
        }
      }));
      
      const success = await updateCodeforcesData(usernames.codeforces);
      if (!success) {
        setRatingsData(prev => ({
          ...prev,
          codeforces: {
            ...prev.codeforces,
            rating: SAMPLE_DATA.CODEFORCES.RATING,
            maxRating: SAMPLE_DATA.CODEFORCES.MAX_RATING,
            rank: SAMPLE_DATA.CODEFORCES.RANK
          }
        }));
      }
      
      setUsernamesSet(true);
    } catch (error) {
      console.error('Error saving usernames:', error)
      Alert.alert("Error", "Failed to save usernames. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUsernames = async () => {
    if (!editCodeforcesUsername || !editLeetcodeUsername || !editCodechefUsername) {
      Alert.alert("Missing Information", "Please enter usernames for all platforms.");
      return;
    }
    
    try {
      setLoading(true);
      const usernames = {
        codeforces: editCodeforcesUsername,
        leetcode: editLeetcodeUsername,
        codechef: editCodechefUsername
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.USERNAMES, JSON.stringify(usernames));
      
      setRatingsData(prev => ({
        codeforces: {
          ...prev.codeforces,
          username: usernames.codeforces,
        },
        leetcode: {
          ...prev.leetcode,
          username: usernames.leetcode,
          rating: SAMPLE_DATA.LEETCODE.RATING,
          maxRating: SAMPLE_DATA.LEETCODE.MAX_RATING,
          rank: SAMPLE_DATA.LEETCODE.RANK
        },
        codechef: {
          ...prev.codechef,
          username: usernames.codechef,
          rating: SAMPLE_DATA.CODECHEF.RATING,
          maxRating: SAMPLE_DATA.CODECHEF.MAX_RATING,
          rank: SAMPLE_DATA.CODECHEF.RANK
        }
      }));
      
      const success = await updateCodeforcesData(usernames.codeforces);
      if (!success) {
        setRatingsData(prev => ({
          ...prev,
          codeforces: {
            ...prev.codeforces,
            rating: SAMPLE_DATA.CODEFORCES.RATING,
            maxRating: SAMPLE_DATA.CODEFORCES.MAX_RATING,
            rank: SAMPLE_DATA.CODEFORCES.RANK
          }
        }));
      }
      
      setEditModalVisible(false);
      Alert.alert("Success", "Your usernames have been updated successfully.");
    } catch (error) {
      console.error('Error updating usernames:', error);
      Alert.alert("Error", "Failed to update usernames. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          {usernamesSet ? (
            <PlatformCards 
              ratingsData={ratingsData} 
              onEditPress={() => setEditModalVisible(true)}
            />
          ) : (
            <UserInfoForm
              codeforcesUsername={codeforcesUsername}
              setCodeforcesUsername={setCodeforcesUsername}
              leetcodeUsername={leetcodeUsername}
              setLeetcodeUsername={setLeetcodeUsername}
              codechefUsername={codechefUsername}
              setCodechefUsername={setCodechefUsername}
              onSubmit={handleSaveUsernames}
            />
          )}
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <Pressable 
            style={homeStyles.modalOverlay} 
            onPress={() => setEditModalVisible(false)}
          >
            <Pressable style={homeStyles.modalContent} onPress={e => e.stopPropagation()}>
              <View style={homeStyles.modalHeader}>
                <Text style={homeStyles.modalTitle}>Edit Your Usernames</Text>
                <TouchableOpacity 
                  style={homeStyles.closeButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Feather name="x" size={UI.ICONS.SIZE.MEDIUM} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={homeStyles.modalDivider} />
              
              <UserInfoForm
                codeforcesUsername={editCodeforcesUsername}
                setCodeforcesUsername={setEditCodeforcesUsername}
                leetcodeUsername={editLeetcodeUsername}
                setLeetcodeUsername={setEditLeetcodeUsername}
                codechefUsername={editCodechefUsername}
                setCodechefUsername={setEditCodechefUsername}
                onSubmit={handleUpdateUsernames}
              />
            </Pressable>
          </Pressable>
        </Modal>
      </ImageBackground>
    </View>
  )
}

export default index