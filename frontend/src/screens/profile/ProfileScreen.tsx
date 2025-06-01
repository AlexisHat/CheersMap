import React from "react";
import { View, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import ProfileAvatar from "../../components/user/ProfileAvatar";
import StatBox from "../../components/user/StatBox";
import { ParamListBase } from "@react-navigation/native";

type User = {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  followers: number;
  following: number;
};

const mockUser: User = {
  id: "1",
  fullName: "John Doe",
  avatarUrl: null,
  followers: 391,
  following: 210,
};
type DrawerNavProp = DrawerNavigationProp<ParamListBase>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavProp>();
  const user = mockUser;
  const { width } = useWindowDimensions();
  const avatarSize = width * 0.35;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user.fullName,
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
  }, [navigation, user.fullName]);

  return (
    <View style={styles.container}>
      <ProfileAvatar uri={user.avatarUrl} size={avatarSize} />
      <View style={styles.statsRow}>
        <StatBox label="Follower" value={user.followers} />
        <StatBox label="Folgt" value={user.following} />
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
  statsRow: {
    flexDirection: "row",
    marginTop: 24,
  },
});
