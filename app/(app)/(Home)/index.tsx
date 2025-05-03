import { 
  ScrollView, 
  Text, 
  View, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Modal,
  Pressable
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import RatingCard from '@/components/ratingCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS, PLATFORM_DATA, UI, SAMPLE_DATA, API } from '@/constants/AppConstants'
import { Feather } from '@expo/vector-icons'
import { homeStyles } from './styles'

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
      logoUri: PLATFORM_DATA.CODEFORCES.LOGO_URI
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
    const userInfo = await fetchCodeforcesUserInfo(username);
    
    if (userInfo) {
      setRatingsData(prev => ({
        ...prev,
        codeforces: {
          ...prev.codeforces,
          username: userInfo.handle,
          rating: userInfo.rating,
          maxRating: userInfo.maxRating,
          rank: userInfo.rank.charAt(0).toUpperCase() + userInfo.rank.slice(1),
        }
      }));
      return true;
    }
    return false;
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
            <>
              <View style={homeStyles.contentContainer}>
                <Text style={homeStyles.welcomeText}>Welcome to Coding Stats</Text>
                <View style={homeStyles.divider} />
                <Text style={homeStyles.subText}>Track Your Competitive Programming Journey</Text>
                <TouchableOpacity 
                  style={homeStyles.editButton}
                  onPress={() => setEditModalVisible(true)}
                >
                  <Feather name="edit-2" size={UI.ICONS.SIZE.SMALL} color={Colors.WHITE} />
                  <Text style={homeStyles.editButtonText}>Edit Usernames</Text>
                </TouchableOpacity>
              </View>

              <View style={homeStyles.cardContainer}>
                <RatingCard {...ratingsData.codeforces} />
              </View>
              <View style={homeStyles.cardContainer}>
                <RatingCard {...ratingsData.leetcode} />
              </View>
              <View style={homeStyles.cardContainer}>
                <RatingCard {...ratingsData.codechef} />
              </View>
            </>
          ) : (
            <View style={homeStyles.formContainer}>
              <Text style={homeStyles.formTitle}>Welcome to Coding Stats!</Text>
              <Text style={homeStyles.formSubtitle}>
                Please enter your usernames for the following platforms to get started.
              </Text>
              
              <View style={homeStyles.inputContainer}>
                <Text style={homeStyles.inputLabel}>Codeforces Username</Text>
                <TextInput
                  style={homeStyles.input}
                  value={codeforcesUsername}
                  onChangeText={setCodeforcesUsername}
                  placeholder="Enter your Codeforces username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={homeStyles.inputContainer}>
                <Text style={homeStyles.inputLabel}>LeetCode Username</Text>
                <TextInput
                  style={homeStyles.input}
                  value={leetcodeUsername}
                  onChangeText={setLeetcodeUsername}
                  placeholder="Enter your LeetCode username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={homeStyles.inputContainer}>
                <Text style={homeStyles.inputLabel}>CodeChef Username</Text>
                <TextInput
                  style={homeStyles.input}
                  value={codechefUsername}
                  onChangeText={setCodechefUsername}
                  placeholder="Enter your CodeChef username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <TouchableOpacity style={homeStyles.saveButton} onPress={handleSaveUsernames}>
                <Text style={homeStyles.saveButtonText}>Save & Continue</Text>
              </TouchableOpacity>
            </View>
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
              
              <View style={homeStyles.inputContainer}>
                <Text style={homeStyles.inputLabel}>Codeforces Username</Text>
                <TextInput
                  style={homeStyles.input}
                  value={editCodeforcesUsername}
                  onChangeText={setEditCodeforcesUsername}
                  placeholder="Enter your Codeforces username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={homeStyles.inputContainer}>
                <Text style={homeStyles.inputLabel}>LeetCode Username</Text>
                <TextInput
                  style={homeStyles.input}
                  value={editLeetcodeUsername}
                  onChangeText={setEditLeetcodeUsername}
                  placeholder="Enter your LeetCode username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={homeStyles.inputContainer}>
                <Text style={homeStyles.inputLabel}>CodeChef Username</Text>
                <TextInput
                  style={homeStyles.input}
                  value={editCodechefUsername}
                  onChangeText={setEditCodechefUsername}
                  placeholder="Enter your CodeChef username"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={homeStyles.modalFooter}>
                <TouchableOpacity 
                  style={homeStyles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={homeStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={homeStyles.updateButton}
                  onPress={handleUpdateUsernames}
                >
                  <Text style={homeStyles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </ImageBackground>
    </View>
  )
}

export default index