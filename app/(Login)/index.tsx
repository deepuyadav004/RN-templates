import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Alert } from "react-native";
import { Pressable } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleSignIn = () => {
        if (email.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
          }
          // Add login logic here
          Alert.alert('Login Successful', `Welcome, ${email}`);
    };

    const handleForgotPassword = () => {
        console.log("Forgot Password clicked");
        // Add your logic for forgot password
      };
  
    const handleSocialLogin = (platform: string) => {
      console.log(`${platform} login clicked`);
      // Add your logic for social login
    };
  
    const handleNewUser = () =>{
      router.push('/(Register)')
    };
    
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login here</Text>
        <Text style={styles.subtitle}>
          Welcome back you’ve been missed!
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signinButton} onPress={handleSignIn}>
          <Text style={styles.signinButtonText}>Sign in</Text>
        </TouchableOpacity>
        <Pressable onPress={handleNewUser}>
          <Text style={styles.alreadyAccount}>Create new account</Text>
        </Pressable>
        <Text style={styles.continueText}>Or continue with</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity onPress={() => handleSocialLogin("Google")}>
            <Image
              source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialLogin("Facebook")}>
            <Image
              source={{ uri: "https://img.icons8.com/fluency/48/facebook-new.png" }}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialLogin("Apple")}>
            <Image
              source={{ uri: 'https://img.icons8.com/?size=100&id=86009&format=png&color=000000' }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f7fa",
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: "#7f8c8d",
      textAlign: "center",
      marginBottom: 20,
    },
    inputContainer: {
      width: "100%",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: "#dce1e5",
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      backgroundColor: "#fff",
      fontSize: 16,
    },
    forgotPassword: {
      color: "#7f8c8d",
      alignSelf: "flex-end",
      marginBottom: 20,
    },
    signinButton: {
      width: "100%",
      height: 50,
      backgroundColor: "#2c3e50",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      marginBottom: 20,
    },
    signinButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    alreadyAccount: {
      fontSize: 14,
      color: "#7f8c8d",
      marginBottom: 10,
    },
    continueText: {
      fontSize: 14,
      color: "#7f8c8d",
      marginBottom: 15,
      marginTop: 50
    },
    socialIcons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "60%",
    },
    icon: {
      width: 40,
      height: 40,
      resizeMode: "contain",
    },
  });

export default LoginScreen;
