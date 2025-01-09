import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Login = () => {
  const router = useRouter();

  const goBack = () => {
    router.push('/(Welcome)'); // Navigate back to the Welcome page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login Page</Text>
      {/* Add login form and functionality here */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Login" color="#1E90FF" onPress={() => { /* handle login */ }} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Go Back" color="#4682B4" onPress={goBack} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5', // Light background color for better appearance
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40, // Space between header and buttons
    color: '#333', // Darker text color for better readability
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: '80%', // Buttons take 80% of screen width
    marginBottom: 20, // Add space between buttons
  },
});

export default Login;
