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
import PostGrid from "../../components/post/PostGrid";

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

  const mockPosts = [
    {
      id: "1",
      frontCamUrl: "https://picsum.photos/seed/selfie1/400",
      backCamUrl: "https://picsum.photos/seed/view1/800",
    },
    {
      id: "2",
      frontCamUrl: "https://picsum.photos/seed/selfie2/400",
      backCamUrl: "https://picsum.photos/seed/view2/800",
    },
    {
      id: "3",
      frontCamUrl: "https://picsum.photos/seed/selfie3/400",
      backCamUrl: "https://picsum.photos/seed/view3/800",
    },
    {
      id: "4",
      frontCamUrl: "https://picsum.photos/seed/selfie4/400",
      backCamUrl: "https://picsum.photos/seed/view4/800",
    },
    {
      id: "5",
      frontCamUrl: "https://picsum.photos/seed/selfie5/400",
      backCamUrl: "https://picsum.photos/seed/view5/800",
    },
    {
      id: "6",
      frontCamUrl: "https://picsum.photos/seed/selfie6/400",
      backCamUrl: "https://picsum.photos/seed/view6/800",
    },
    {
      id: "7",
      frontCamUrl: "https://picsum.photos/seed/selfie7/400",
      backCamUrl: "https://picsum.photos/seed/view7/800",
    },
    {
      id: "8",
      frontCamUrl: "https://picsum.photos/seed/selfie8/400",
      backCamUrl: "https://picsum.photos/seed/view8/800",
    },
    {
      id: "9",
      frontCamUrl: "https://picsum.photos/seed/selfie9/400",
      backCamUrl: "https://picsum.photos/seed/view9/800",
    },
    {
      id: "10",
      frontCamUrl: "https://picsum.photos/seed/selfie10/400",
      backCamUrl: "https://picsum.photos/seed/view10/800",
    },
    {
      id: "11",
      frontCamUrl: "https://picsum.photos/seed/selfie11/400",
      backCamUrl: "https://picsum.photos/seed/view11/800",
    },
  ];

  return (
    <View style={styles.container}>
      <ProfileAvatar uri={user.profilePicUrl} size={avatarSize} />
      <Text style={styles.username}>@{user.username}</Text>
      {user.city && <Text style={styles.city}>{user.city}</Text>}
      <View style={styles.statsRow}>
        <StatBox label="Follower" value={0} />
        <StatBox label="Folgt" value={0} />
      </View>
      <View style={styles.postsSection}>
        <Text style={styles.postsHeading}>Beiträge</Text>
        <PostGrid posts={mockPosts} />
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
  postsSection: {
    marginTop: 16,
    flex: 1,
  },
  postsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
});
