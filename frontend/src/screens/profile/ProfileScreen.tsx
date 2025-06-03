import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import ProfileAvatar from "../../components/user/ProfileAvatar";
import StatBox from "../../components/user/StatBox";
import { ParamListBase } from "@react-navigation/native";
import { useUserStore } from "../../store/profileStore";

type DrawerNavProp = DrawerNavigationProp<ParamListBase>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavProp>();
  const { width } = useWindowDimensions();
  const avatarSize = width * 0.35;

  const { user } = useUserStore();

  React.useLayoutEffect(() => {
    if (!user) return;

    navigation.setOptions({
      headerTitle: `${user.vorname ?? ""} ${user.nachname ?? ""}`.trim(),
      headerTitleAlign: "center",
      headerRight: () => (
        <Pressable
          accessibilityLabel="Öffne Menü"
          hitSlop={8}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ paddingHorizontal: 12 }}
        >
          <MaterialIcons name="menu" size={24} color="#000" />
        </Pressable>
      ),
    });
  }, [navigation, user]);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 12 }}>Profil wird geladen...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileAvatar uri={user.profilePicUrl} size={avatarSize} />
      <Text style={styles.username}>@{user.username}</Text>
      {user.city && <Text style={styles.city}>{user.city}</Text>}
      <View style={styles.statsRow}>
        <StatBox label="Follower" value={0} />
        <StatBox label="Folgt" value={0} />
      </View>
    </View>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  username: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  city: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 24,
  },
});
