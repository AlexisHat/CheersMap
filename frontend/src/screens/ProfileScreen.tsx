import { View, Text, Button, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { logout } from "../services/authService";

const ProfileScreen = () => {
  const handleLogout = async () => {
    await logout();
    await useAuthStore.getState().logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hier kann das Profil hinkommen</Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Hier kann das Profil hinkommen
        </Text>
        <Button onPress={handleLogout} title="Logout" />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
