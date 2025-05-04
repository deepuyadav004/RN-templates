import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/AppConstants';

export default function useUserPreferences() {
  const [codeforcesUsername, setCodeforcesUsername] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [codechefUsername, setCodechefUsername] = useState('');
  const [editCodeforcesUsername, setEditCodeforcesUsername] = useState('');
  const [editLeetcodeUsername, setEditLeetcodeUsername] = useState('');
  const [editCodechefUsername, setEditCodechefUsername] = useState('');
  const [usernamesSet, setUsernamesSet] = useState(false);

  const saveUsernames = async (cf: string, lc: string, cc: string) => {
    const usernames = { codeforces: cf, leetcode: lc, codechef: cc };
    await AsyncStorage.setItem(STORAGE_KEYS.USERNAMES, JSON.stringify(usernames));
    return usernames;
  };

  const loadUsernames = async () => {
    const storedUsernames = await AsyncStorage.getItem(STORAGE_KEYS.USERNAMES);
    if (storedUsernames) {
      return JSON.parse(storedUsernames);
    }
    return null;
  };

  const initializeEditUsernames = (cf: string, lc: string, cc: string) => {
    setEditCodeforcesUsername(cf);
    setEditLeetcodeUsername(lc);
    setEditCodechefUsername(cc);
  };

  return {
    codeforcesUsername, setCodeforcesUsername,
    leetcodeUsername, setLeetcodeUsername,
    codechefUsername, setCodechefUsername,
    editCodeforcesUsername, setEditCodeforcesUsername,
    editLeetcodeUsername, setEditLeetcodeUsername,
    editCodechefUsername, setEditCodechefUsername,
    usernamesSet, setUsernamesSet,
    saveUsernames, loadUsernames, initializeEditUsernames
  };
}
