import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';

interface CodeforcesProps {
  userName: string;
}

const Codeforces: React.FC<CodeforcesProps> = ({ userName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Detailed profile information is available on Codeforces website.</Text>
    </View>
  );
}

export default Codeforces;

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