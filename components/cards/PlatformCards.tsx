import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RatingCard from '@/components/ratingCard';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { UI } from '@/constants/AppConstants';

interface PlatformCardsProps {
  ratingsData: {
    codeforces: any;
    leetcode: any;
    codechef: any;
  };
  onEditPress: () => void;
  hideEditButton?: boolean;
}

const PlatformCards = ({ ratingsData, onEditPress, hideEditButton = false }: PlatformCardsProps) => {
  return (
    <>
      {!hideEditButton && (
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Welcome to Coding Stats</Text>
          <View style={styles.divider} />
          <Text style={styles.subText}>Track Your Competitive Programming Journey</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEditPress}
          >
            <Feather name="edit-2" size={UI.ICONS.SIZE.SMALL} color={Colors.WHITE} />
            <Text style={styles.editButtonText}>Edit Usernames</Text>
          </TouchableOpacity>
        </View>
      )}

      {!ratingsData.codeforces.isHidden && (
        <View style={styles.cardContainer}>
          <RatingCard {...ratingsData.codeforces} />
        </View>
      )}
      {!ratingsData.leetcode.isHidden && (
        <View style={styles.cardContainer}>
          <RatingCard {...ratingsData.leetcode} />
        </View>
      )}
      {!ratingsData.codechef.isHidden && (
        <View style={styles.cardContainer}>
          <RatingCard {...ratingsData.codechef} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI.PADDING.VERTICAL,
    marginTop: UI.MARGIN.TOP,
    marginBottom: UI.MARGIN.BOTTOM,
    backgroundColor: `rgba(0,0,0,${UI.CONTAINER_OPACITY})`,
    borderRadius: UI.BORDER_RADIUS.CARD,
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 15,
  },
  editButtonText: {
    color: Colors.WHITE,
    fontFamily: 'Gudea-Regular',
    fontSize: 14,
    marginLeft: 5,
  },
  cardContainer: {
    width: '100%',
    marginBottom: UI.MARGIN.BOTTOM,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default PlatformCards;
