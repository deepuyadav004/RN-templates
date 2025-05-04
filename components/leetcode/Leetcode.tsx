import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';

interface LeetcodeProps {
  userName?: string;
}

const Leetcode: React.FC<LeetcodeProps> = ({ userName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Detailed profile information is available on LeetCode website.</Text>
    </View>
  );
}

export default Leetcode;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: 'Gudea-Italic',
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 8,
  }
});