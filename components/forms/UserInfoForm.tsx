import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { UI } from '@/constants/AppConstants';

interface UserInfoFormProps {
  codeforcesUsername: string;
  setCodeforcesUsername: (value: string) => void;
  leetcodeUsername: string;
  setLeetcodeUsername: (value: string) => void;
  codechefUsername: string;
  setCodechefUsername: (value: string) => void;
  onSubmit: () => void;
}

const UserInfoForm = ({
  codeforcesUsername,
  setCodeforcesUsername,
  leetcodeUsername,
  setLeetcodeUsername,
  codechefUsername,
  setCodechefUsername,
  onSubmit
}: UserInfoFormProps) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Welcome to Coding Stats!</Text>
      <Text style={styles.formSubtitle}>
        Please enter your usernames for the following platforms to get started.
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Codeforces Username</Text>
        <TextInput
          style={styles.input}
          value={codeforcesUsername}
          onChangeText={setCodeforcesUsername}
          placeholder="Enter your Codeforces username"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>LeetCode Username</Text>
        <TextInput
          style={styles.input}
          value={leetcodeUsername}
          onChangeText={setLeetcodeUsername}
          placeholder="Enter your LeetCode username"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>CodeChef Username</Text>
        <TextInput
          style={styles.input}
          value={codechefUsername}
          onChangeText={setCodechefUsername}
          placeholder="Enter your CodeChef username"
          placeholderTextColor="#999"
        />
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={onSubmit}>
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: UI.BORDER_RADIUS.CARD,
    padding: UI.PADDING.VERTICAL,
    marginTop: UI.MARGIN.TOP,
    marginBottom: UI.MARGIN.BOTTOM,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
    textAlign: 'center',
    marginBottom: 15,
  },
  formSubtitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: UI.MARGIN.BOTTOM,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Gudea-Regular',
  },
  saveButton: {
    backgroundColor: Colors.CORAL,
    borderRadius: UI.BORDER_RADIUS.BUTTON,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'Gudea-Bold',
  },
});

export default UserInfoForm;
