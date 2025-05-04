import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
// Fix the import path for styles
import { homeStyles } from '@/app/(app)/(Home)/styles';
import { UI } from '@/constants/AppConstants';
import UserInfoForm from '@/components/forms/UserInfoForm';

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  codeforcesUsername: string;
  setCodeforcesUsername: (value: string) => void;
  leetcodeUsername: string;
  setLeetcodeUsername: (value: string) => void;
  codechefUsername: string;
  setCodechefUsername: (value: string) => void;
  onSubmit: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  onClose,
  codeforcesUsername,
  setCodeforcesUsername,
  leetcodeUsername,
  setLeetcodeUsername,
  codechefUsername,
  setCodechefUsername,
  onSubmit
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        style={homeStyles.modalOverlay} 
        onPress={onClose}
      >
        <Pressable style={homeStyles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.modalTitle}>Edit Your Usernames</Text>
            <TouchableOpacity 
              style={homeStyles.closeButton}
              onPress={onClose}
            >
              <Feather name="x" size={UI.ICONS.SIZE.MEDIUM} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={homeStyles.modalDivider} />
          
          <UserInfoForm
            codeforcesUsername={codeforcesUsername}
            setCodeforcesUsername={setCodeforcesUsername}
            leetcodeUsername={leetcodeUsername}
            setLeetcodeUsername={setLeetcodeUsername}
            codechefUsername={codechefUsername}
            setCodechefUsername={setCodechefUsername}
            onSubmit={onSubmit}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditUserModal;
