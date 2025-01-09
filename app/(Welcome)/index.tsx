import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter from expo-router

const WelcomePage = () => {
  const router = useRouter();  // Initialize the router
  
  const handleLogin = () => {
    router.push('/(Login)');  // Navigate to login page
  };

  const handleRegister = () => {
    router.push('/(Register)');  // Navigate to register page
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/welcomeImage.png')}  // Replace with your image path
        style={styles.image}
      />
      <Text style={styles.text}>Showcase your achievements and skills</Text>

      <View style={styles.buttonContainer}>
        <Button title="Login" color="#1E90FF" onPress={handleLogin} />
        <Button title="Register" color="#4682B4" onPress={handleRegister} />
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
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default WelcomePage;
