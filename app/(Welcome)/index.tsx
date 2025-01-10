import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

const WelcomePage = () => {
  const router = useRouter(); // Initialize the router

  const handleLogin = () => {
    router.push('/(Login)'); // Navigate to login page
  };

  const handleRegister = () => {
    router.push('/(Register)'); // Navigate to register page
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/welcomeImage.png')} // Replace with your image path
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Our Profiler App </Text>
      <Text style={styles.subtitle}>Showcase your achievements and skills</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
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
    backgroundColor: '#F6F9FC',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
    borderRadius: 20, // Add rounded corners to the image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  loginButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  registerButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#4682B4',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomePage;
