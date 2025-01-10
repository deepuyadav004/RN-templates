import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button, Pressable } from "react-native";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    router.push('/(Login)')
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`${platform} login clicked`);
    // Add your logic for social login
  };

  const handleExistingUser = () =>{
    router.push('/(Login)')
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Create an account to present all your profile within one platform
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>Sign up</Text>
      </TouchableOpacity>
      <Pressable onPress={handleExistingUser}>
        <Text style={styles.alreadyAccount}>Already have an account</Text>
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
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  signupButtonText: {
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

export default RegisterScreen;
