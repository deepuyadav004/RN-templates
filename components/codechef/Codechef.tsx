import { View, StyleSheet, Text } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';

interface CodechefProps {
  userName?: string;
}

const Codechef: React.FC<CodechefProps> = ({ userName }) => {
  return (
    <View style={styles.container}>
      {/* Removed "CodeChef Profile" heading */}
    </View>
  );
}

export default Codechef;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
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