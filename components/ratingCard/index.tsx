import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { Feather } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

interface RatingCardProps {
  platformName: string
  rating: number | string
  username: string
  logoUri?: string
  maxRating?: number | string
  rank?: string
  backgroundColor?: string
  textColor?: string
  isError?: boolean
  errorMessage?: string
}

const RatingCard = ({
  platformName,
  rating,
  username,
  logoUri,
  maxRating,
  rank,
  backgroundColor = Colors.WHITE,
  textColor = Colors.DARK_GREEN,
  isError = false,
  errorMessage = "An error occurred"
}: RatingCardProps) => {
  
  // Display error card if isError is true
  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: '#FFEBEE' }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.platformName, { color: '#D32F2F' }]}>{platformName}</Text>
          {logoUri && (
            <Image
              source={{ uri: logoUri }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={36} color="#D32F2F" style={styles.errorIcon} />
          <Text style={styles.errorText}>{typeof errorMessage === 'string' ? errorMessage : 'Error occurred'}</Text>
          <Text style={styles.usernameError}>Username: {username}</Text>
        </View>
      </View>
    );
  }

  // Regular rating card with improved design
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.platformName, { color: textColor }]}>{platformName}</Text>
        {logoUri && (
          <Image
            source={{ uri: logoUri }}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Current Rating</Text>
        <Text style={styles.ratingValue}>{rating}</Text>
        {maxRating > 0 && maxRating !== null && (
          <View style={styles.maxRatingContainer}>
            <Text style={styles.maxRatingLabel}>Max:</Text>
            <Text style={styles.maxRatingValue}>{maxRating}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.username}>{username}</Text>
        {rank && <Text style={styles.rank}>{rank}</Text>}
      </View>
    </View>
  );
};

export default RatingCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 12,
    marginVertical: 10,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  platformName: {
    fontSize: 22,
    fontFamily: 'Gudea-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 12,
    padding: 12,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Gudea-Regular',
    color: '#666',
  },
  ratingValue: {
    fontSize: 42,
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
    marginVertical: 8,
  },
  maxRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  maxRatingLabel: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    marginRight: 5,
  },
  maxRatingValue: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.CORAL,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  username: {
    fontSize: 16,
    fontFamily: 'Gudea-Regular',
    color: '#333',
  },
  rank: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.CORAL,
    backgroundColor: 'rgba(255, 127, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginVertical: 8,
  },
  errorIcon: {
    marginBottom: 8,
  },
  usernameError: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    marginTop: 8,
  }
})
